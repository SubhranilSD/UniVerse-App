const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = "C:\\Users\\subhr\\Desktop" // wait, no. Windows absolute path.
const absolutePath = 'D:\\COLLEGE_KRMU\\SEMESTER 2\\MINOR PROJECT\\NEURAL NINJAS + BACKEND\\ProjexaAI\\data.db';
const db = new sqlite3.Database(absolutePath, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the SQLite database.");

    // Migrate standard passwords for testing
    db.run(
      `ALTER TABLE profile ADD COLUMN password TEXT DEFAULT 'password123'`,
      (err) => {
        if (err && !err.message.includes("duplicate column name"))
          console.error(err);
      }
    );
    db.run(
      `ALTER TABLE students ADD COLUMN password TEXT DEFAULT 'password123'`,
      (err) => {
        if (err && !err.message.includes("duplicate column name"))
          console.error(err);
      }
    );
    db.run(
      `ALTER TABLE students ADD COLUMN account_status TEXT DEFAULT 'Active'`,
      (err) => {
        if (err && !err.message.includes("duplicate column name"))
          console.error(err);
      }
    );

    db.run(`ALTER TABLE students ADD COLUMN att_maths_att INTEGER DEFAULT 18`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN att_maths_tot INTEGER DEFAULT 20`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN att_ds_att INTEGER DEFAULT 18`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN att_ds_tot INTEGER DEFAULT 20`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN att_os_att INTEGER DEFAULT 18`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN att_os_tot INTEGER DEFAULT 20`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN att_english_att INTEGER DEFAULT 18`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN att_english_tot INTEGER DEFAULT 20`, (err) => {  });

    db.run(`ALTER TABLE students ADD COLUMN latitude REAL DEFAULT 28.5200`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN longitude REAL DEFAULT 77.0600`, (err) => {  });

    db.run(`
      CREATE TABLE IF NOT EXISTS curriculum (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT,
        day_of_week TEXT,
        start_time TEXT,
        end_time TEXT,
        room TEXT
      )
    `);

    db.run(`ALTER TABLE students ADD COLUMN profile_image TEXT DEFAULT ''`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN attendance_pct REAL DEFAULT 80.0`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN gpa REAL DEFAULT 8.0`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN mental_health_score INTEGER DEFAULT 85`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN pending_assignments INTEGER DEFAULT 0`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN pending_tasks INTEGER DEFAULT 0`, (err) => {  });
    
    // Backfill existing students with random metrics if they are at defaults
    db.all("SELECT id FROM students WHERE attendance_pct = 80.0 AND gpa = 8.0", [], (err, rows) => {
      if (!err && rows) {
        rows.forEach(row => {
          const attendance = (72 + Math.random() * 26).toFixed(1);
          const gpa = (6.5 + Math.random() * 3.3).toFixed(1);
          const mh = Math.floor(60 + Math.random() * 36);
          const pa = Math.floor(Math.random() * 6);
          db.run("UPDATE students SET attendance_pct = ?, gpa = ?, mental_health_score = ?, pending_assignments = ? WHERE id = ?", 
            [attendance, gpa, mh, pa, row.id]);
        });
      }
    });

    db.run(`ALTER TABLE students ADD COLUMN marks_maths INTEGER DEFAULT 75`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN marks_ds INTEGER DEFAULT 75`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN marks_os INTEGER DEFAULT 75`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN marks_english INTEGER DEFAULT 75`, (err) => {  });

    db.run(`ALTER TABLE students ADD COLUMN tasks TEXT DEFAULT '[]'`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN submissions TEXT DEFAULT '[]'`, (err) => {  });

    // Hardcode a special password for the test students just to be sure
    db.run(`ALTER TABLE students ADD COLUMN email_notify INTEGER DEFAULT 1`, (err) => {  });
    db.run(`ALTER TABLE students ADD COLUMN sms_notify INTEGER DEFAULT 1`, (err) => {  });
    db.run(`ALTER TABLE profile ADD COLUMN email_notify INTEGER DEFAULT 1`, (err) => {  });
    db.run(`ALTER TABLE profile ADD COLUMN sms_notify INTEGER DEFAULT 1`, (err) => {  });
    db.run(`UPDATE students SET password = 'password123' WHERE password IS NULL`);
    db.run(`UPDATE profile SET password = 'password123' WHERE password IS NULL`);
  }
});

// Helper for promise-based queries
const allAsync = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAsync = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const runAsync = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// --- AUTHENTICATION ---
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check students
    let user = await getAsync(
      "SELECT * FROM students WHERE email = ? AND password = ?",
      [email, password]
    );
    if (user) {
        if (user.account_status === 'Pending') {
            return res.status(401).json({ success: false, error: "Your account is pending administrator approval. Please wait for verification." });
        }
        return res.json({ success: true, user, role: "student" });
    }

    // Check profile
    user = await getAsync(
      "SELECT * FROM profile WHERE email = ? AND password = ?",
      [email, password]
    );
    if (user) return res.json({ success: true, user, role: "admin" });

    // Fallback: If they use Roll No instead of email
    user = await getAsync(
      "SELECT * FROM students WHERE roll_no = ? AND password = ?",
      [email, password]
    );
    if (user) {
        if (user.account_status === 'Pending') {
            return res.status(401).json({ success: false, error: "Your account is pending administrator approval. Please wait for verification." });
        }
        return res.json({ success: true, user, role: "student" });
    }

    res.status(401).json({ success: false, error: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- AUTHENTICATION ---
app.post("/api/register", (req, res) => {
  const { full_name, email, password } = req.body;
  if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
  }
  
  const date = new Date().toISOString().split("T")[0];
  const roll_no = "REG-" + Math.floor(100000 + Math.random() * 900000); // Generate 6 digit pin
  
  // High-fidelity random metrics generation
  const attendance = (75 + Math.random() * 23).toFixed(1);
  const gpa = (6.8 + Math.random() * 3.0).toFixed(1);
  const mental_health = Math.floor(65 + Math.random() * 31);
  const pending_assign = Math.floor(Math.random() * 5);

  db.run(
    `INSERT INTO students(full_name, email, password, roll_no, admission_date, account_status, attendance_pct, gpa, mental_health_score, pending_assignments)
     VALUES (?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?)`,
    [full_name, email, password, roll_no, date, attendance, gpa, mental_health, pending_assign],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
            return res.status(400).json({ success: false, error: "Email already registered." });
        }
        return res.status(500).json({ success: false, error: err.message });
      }
      res.status(201).json({ success: true, message: "Account created successfully" });
    }
  );
});

// --- API ENDPOINTS ---

// Get pending/unverified accounts
app.get("/api/students/pending", async (req, res) => {
  try {
    const rows = await allAsync("SELECT id, full_name, email, roll_no, admission_date FROM students WHERE account_status = 'Pending' ORDER BY admission_date DESC");
    res.json(rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate (approve) a pending account
app.put("/api/students/:id/validate", (req, res) => {
  const { id } = req.params;
  db.run("UPDATE students SET account_status = 'Active' WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Student not found" });
    res.json({ success: true, message: "Account verified and activated." });
  });
});

// Deny (reject) a pending account
app.put("/api/students/:id/deny", (req, res) => {
  const { id } = req.params;
  db.run("UPDATE students SET account_status = 'Denied' WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Student not found" });
    res.json({ success: true, message: "Account denied." });
  });
});


app.get("/api/profile", async (req, res) => {
  const row = await getAsync("SELECT * FROM profile WHERE id=1");
  res.json(row || {});
});

app.get("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  const row = await getAsync("SELECT * FROM students WHERE id = ?", [id]);
  if (row) {
      if (typeof row.tasks === 'string') {
          try { row.tasks = JSON.parse(row.tasks); } catch(e) { row.tasks = []; }
      } else if (!row.tasks) row.tasks = [];
      
      if (typeof row.submissions === 'string') {
          try { row.submissions = JSON.parse(row.submissions); } catch(e) { row.submissions = []; }
      } else if (!row.submissions) row.submissions = [];
      
      res.json(row);
  }
  else res.status(404).json({ error: "Student not found" });
});

app.put("/api/students/:id/tasks", async (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;
  const sql = `UPDATE students SET tasks=? WHERE id=?`;
  db.run(sql, [JSON.stringify(tasks), id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Tasks synced dynamically!" });
  });
});

app.put("/api/students/:id/submissions", async (req, res) => {
  const { id } = req.params;
  const { submissions } = req.body;
  const sql = `UPDATE students SET submissions=? WHERE id=?`;
  db.run(sql, [JSON.stringify(submissions), id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Submissions synced dynamically!" });
  });
});

app.put("/api/profile/:id", (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, address, dob, blood_group } = req.body;
  const sql = `UPDATE profile SET full_name=?, email=?, phone=?, address=?, dob=?, blood_group=? WHERE id=?`;
  db.run(sql, [full_name, email, phone, address, dob, blood_group, id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Profile successfully updated in database!" });
  });
});

app.post("/api/students/:id/update_marks", async (req, res) => {
  const { id } = req.params;
  const { subject, score } = req.body;
  
  try {
    // 1. Update the specific subject mark
    const validSubjects = ['marks_maths', 'marks_ds', 'marks_os', 'marks_english'];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({ error: "Invalid subject" });
    }

    await runAsync(`UPDATE students SET ${subject} = ? WHERE id = ?`, [score, id]);

    // 2. Recalculate GPA
    const student = await getAsync("SELECT marks_maths, marks_ds, marks_os, marks_english FROM students WHERE id = ?", [id]);
    const total = student.marks_maths + student.marks_ds + student.marks_os + student.marks_english;
    const newGpa = ((total / 400) * 10).toFixed(1);

    await runAsync("UPDATE students SET gpa = ? WHERE id = ?", [newGpa, id]);

    res.json({ 
      message: "Marks and GPA updated successfully", 
      newGpa,
      marks: { [subject]: score }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/students/:id", (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, address, dob, blood_group, profile_image, roll_no } = req.body;
  const sql = `UPDATE students SET full_name=?, email=?, phone=?, address=?, dob=?, blood_group=?, profile_image=?, roll_no=? WHERE id=?`;
  db.run(sql, [full_name, email, phone, address, dob, blood_group, profile_image, roll_no, id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Student record securely updated!" });
  });
});

app.put("/api/students/:id/security", async (req, res) => {
  const { id } = req.params;
  const { current_password, new_password } = req.body;
  const user = await getAsync("SELECT password FROM students WHERE id = ?", [id]);
  if (!user || user.password !== current_password) return res.status(400).json({ error: "Invalid current password" });
  db.run("UPDATE students SET password = ? WHERE id = ?", [new_password, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Security Key Updated" });
  });
});

app.put("/api/profile/:id/security", async (req, res) => {
  const { id } = req.params;
  const { current_password, new_password } = req.body;
  const user = await getAsync("SELECT password FROM profile WHERE id = ?", [id]);
  if (!user || user.password !== current_password) return res.status(400).json({ error: "Invalid current password" });
  db.run("UPDATE profile SET password = ? WHERE id = ?", [new_password, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Security Key Updated" });
  });
});

app.put("/api/students/:id/preferences", (req, res) => {
  const { id } = req.params;
  const { email_notify, sms_notify } = req.body;
  db.run("UPDATE students SET email_notify = ?, sms_notify = ? WHERE id = ?", [email_notify, sms_notify, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Preferences Saved" });
  });
});

app.put("/api/profile/:id/preferences", (req, res) => {
  const { id } = req.params;
  const { email_notify, sms_notify } = req.body;
  db.run("UPDATE profile SET email_notify = ?, sms_notify = ? WHERE id = ?", [email_notify, sms_notify, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Preferences Saved" });
  });
});

app.put("/api/students/:id/profile", async (req, res) => {
  const { full_name, phone, address, profile_image } = req.body;
  const { id } = req.params;
  try {
    await runAsync(
      "UPDATE students SET full_name = ?, phone = ?, address = ?, profile_image = ? WHERE id = ?",
      [full_name, phone, address, profile_image, id]
    );
    res.json({ message: "Student Profile Updated Successfully in Database layer." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/students/:id/validate", async (req, res) => {
  const { id } = req.params;
  db.run(`UPDATE students SET account_status = 'Active' WHERE id = ?`, [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Student account officially validated." });
  });
});

app.get("/api/students", async (req, res) => {
  const students = await allAsync("SELECT * FROM students");
  res.json(students);
});

app.post("/api/students", (req, res) => {
  const data = req.body;
  const date = new Date().toISOString().split("T")[0];
  
  // High-fidelity random metrics generation for Admin-created accounts
  const attendance = data.attendance_pct || (75 + Math.random() * 23).toFixed(1);
  const gpa = data.gpa || (7.0 + Math.random() * 2.8).toFixed(1);
  const mental_health = data.mental_health_score || Math.floor(70 + Math.random() * 26);
  const pending_assign = Math.floor(Math.random() * 4);

  db.run(
    `INSERT INTO students(full_name, roll_no, email, phone, stream, current_class, section, dob, blood_group, gender, admission_date, profile_image, attendance_pct, gpa, mental_health_score, pending_assignments)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.full_name,
      data.roll_no,
      data.email,
      data.phone,
      data.stream,
      data.current_class,
      data.section,
      data.dob,
      data.blood_group,
      data.gender,
      date,
      data.profile_image || '',
      attendance,
      gpa,
      mental_health,
      pending_assign
    ],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ message: "Student created successfully with synchronized metrics" });
    }
  );
});

app.get("/api/fees", async (req, res) => {
  const fees = await allAsync(`
        SELECT fees.*, students.full_name, students.roll_no 
        FROM fees JOIN students ON fees.student_id = students.id
    `);
  res.json(fees);
});

app.post("/api/fees/remind", (req, res) => {
  res.json({ message: `Reminder sent to Student ID ${req.body.student_id}` });
});

app.get("/api/curriculum", async (req, res) => {
  const curriculum = await allAsync("SELECT * FROM curriculum");
  res.json(curriculum);
});

app.get("/api/circulars", async (req, res) => {
  const circulars = await allAsync("SELECT * FROM circulars ORDER BY date_posted DESC");
  res.json(circulars);
});

app.post("/api/circulars", (req, res) => {
  const date = new Date().toISOString().split("T")[0];
  db.run(
    "INSERT INTO circulars(title, content, audience, date_posted) VALUES (?, ?, ?, ?)",
    [req.body.title, req.body.content, req.body.audience, date],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Circular posted" });
    }
  );
});

app.get("/api/stats", async (req, res) => {
  try {
    const total_students = (await getAsync("SELECT count(*) as c FROM students")).c;
    const total_faculty = (await getAsync("SELECT count(*) as c FROM faculty")).c;
    const library_books = (await getAsync("SELECT count(*) as c FROM library_books")).c;
    const pending_fees_row = await getAsync("SELECT sum(amount) as s FROM fees WHERE status='Pending'");
    const pending_fees = pending_fees_row.s || 0;

    res.json({ total_students, total_faculty, library_books, pending_fees });
  } catch (err) {
    res.json({ total_students: 0, total_faculty: 0, library_books: 0, pending_fees: 0 });
  }
});

app.get("/api/mental-health", async (req, res) => {
  const { studentId } = req.query;
  
  try {
    let stats;
    if (studentId) {
      stats = await getAsync("SELECT attendance_pct, gpa, mental_health_score, pending_assignments FROM students WHERE id = ?", [studentId]);
    }

    // Fallback if no studentId provided or student not found
    const attendance = stats ? stats.attendance_pct : (Math.floor(Math.random() * (98 - 72 + 1)) + 72);
    const gpa = stats ? stats.gpa : (Math.random() * (9.8 - 6.5) + 6.5).toFixed(1);
    const pending_assignments = stats ? stats.pending_assignments : Math.floor(Math.random() * 6);
    const final_score = stats ? stats.mental_health_score : 85;

    let status = "Optimal Synchronization";
    if (final_score < 80) status = "Elevated Cognitive Load";
    if (final_score < 60) status = "Severely Fragmented Baseline";

    res.json({
      score: final_score,
      status: status,
      metrics: { 
        attendance: parseFloat(attendance), 
        gpa: parseFloat(gpa), 
        pending_assignments 
      },
      recommendations: [
        { title: "Neuro-Acoustic Calibration" },
        { title: "Sleep Cycle Realignment" }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/transportation/predict", (req, res) => {
  const current_cgpa = (6.5 + Math.random() * 2).toFixed(1);
  const predicted_cgpa = Math.min(10.0, (parseFloat(current_cgpa) + Math.random() * 0.8)).toFixed(1);

  res.json({
    current_cgpa,
    predicted_cgpa,
    priorities: [
      { subject: "Data Structures", priority: "High", reason: "Exam in 3 days" },
      { subject: "Operating Systems", priority: "Medium", reason: "Declining Trend" },
    ],
  });
});

app.post("/api/transportation/sync", (req, res) => {
  const { exec } = require("child_process");
  const pythonPath = "python"; // Ensure python is in PATH
  const scriptPath = path.join(__dirname, "generate_map.py");
  
  exec(`${pythonPath} "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Sync Error: ${error.message}`);
      return res.status(500).json({ success: false, error: error.message });
    }
    console.log(`Sync Output: ${stdout}`);
    res.json({ success: true, message: "Neural Map Synchronized Successfully." });
  });
});

// ─── AI CHATBOT ENGINE ───────────────────────────────────────────────────────
const chatKnowledgeBase = [
  // Mental Health
  { patterns: ['stress','stressed','overwhelmed','anxious','anxiety','burnout','tired','exhausted'], context: 'mental_health',
    responses: [
      "It sounds like you're carrying a heavy load right now. That's completely okay — academics can be intense. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. It resets your nervous system instantly.",
      "Stress is your brain's signal that something matters to you — that's actually healthy in small doses. But chronic stress needs a release valve. I recommend a 10-minute walk, no phone, every day. Would you like some academic stress-reduction routines?",
      "You're not alone. Many students experience this. Consider breaking your tasks into 25-minute focused blocks (Pomodoro technique). Small wins build momentum. What specific subject or deadline is stressing you most?"
    ]
  },
  { patterns: ['depressed','depression','sad','hopeless','crying','low','worthless','alone','lonely'], context: 'mental_health',
    responses: [
      "I hear you, and I want you to know that what you're feeling is valid. Depression is real and it's not weakness — it's a signal that you need support. Please consider talking to a counselor. In the meantime, I'm here. What's been weighing on you?",
      "Feeling low is hard. One small step that can help is 10 minutes of sunlight and movement in the morning — it directly affects serotonin. Can you tell me more about what's been happening?",
      "You matter, and your wellbeing is the most important thing. If you're feeling hopeless, please reach out to iCall: 9152987821 (India). I'm also here to support you through your academic concerns."
    ]
  },
  { patterns: ['sleep','insomnia','cant sleep','not sleeping','tired all day'], context: 'mental_health',
    responses: [
      "Poor sleep is one of the biggest academic performance killers. Try the 4-7-8 breathing technique before bed: inhale 4 seconds, hold 7, exhale 8. No screens 30 minutes before sleep. Aim for 7-8 hours.",
      "Sleep debt is real — it accumulates and affects memory, focus, and mood. A consistent sleep schedule (same time every day, even weekends) is the most powerful fix. What's keeping you up?"
    ]
  },
  { patterns: ['motivation','lazy','cant focus','procrastinating','procrastination','distracted'], context: 'mental_health',
    responses: [
      "Motivation often follows action, not the other way around. Start with just 2 minutes on a task — your brain will usually continue. The hardest part is always starting. What task are you avoiding right now?",
      "Procrastination is often driven by fear of failure or perfectionism. Try setting an intentionally imperfect goal: 'Write one bad paragraph.' That lowers the bar and gets you moving.",
      "Focus is a muscle. Train it with 25-minute sprint sessions (Pomodoro). Put your phone in another room — out of sight, out of mind. Want me to generate a study schedule?"
    ]
  },
  // Academic
  { patterns: ['attendance','absent','miss class','missed class','low attendance'], context: 'academic',
    responses: [
      "Attendance below 75% can affect your eligibility for exams at KRMU. I'd recommend talking to your subject teacher early — they may allow you to make up sessions. Which subject is the concern?",
      "Your attendance is tracked in real-time on your dashboard. If you've missed classes, check if any lectures are recorded or have notes shared on the LMS. Consistent attendance also directly boosts your mental health score here."
    ]
  },
  { patterns: ['exam','exams','test','quiz','study','prepare','preparation'], context: 'academic',
    responses: [
      "For effective exam prep: (1) Active recall > passive reading. Test yourself. (2) Spaced repetition — review material after 1 day, 3 days, 1 week. (3) Past papers are gold. Which subject's exam is coming up?",
      "Study smarter, not harder. Use the Feynman technique: explain the concept in simple words as if teaching a child. If you can't, you don't know it yet. What topic are you preparing for?"
    ]
  },
  { patterns: ['gpa','marks','grade','grades','cgpa','score','result'], context: 'academic',
    responses: [
      "Your GPA is calculated from your internal marks, assignments, and semester exams. You can take online diagnostic tests right here in the app to practice and update your scores. Want tips to improve in a specific subject?",
      "A lower GPA is not permanent — it's data. Each subject has improvement opportunities: online tests, assignments, and participation. Which subject are you working on?"
    ]
  },
  { patterns: ['assignment','homework','submission','deadline','due'], context: 'academic',
    responses: [
      "For assignment management, try time-boxing: assign fixed time slots for each assignment. Break it into sub-tasks (research, outline, draft, review). Which assignment do you need help with?",
      "Deadline stress is real. Prioritize by urgency x importance matrix: urgent+important → do now. Not urgent+important → schedule. What's your nearest deadline?"
    ]
  },
  // Campus / General
  { patterns: ['fee','fees','payment','fine','challan'], context: 'campus',
    responses: [
      "Fee details and payment status are available in the Fees & Finance section of your dashboard. If you're facing financial difficulty, KRMU has a scholarship committee — consider reaching out to the administration.",
      "You can check your pending fees, payment history, and generate challans in the Fees & Finance tab. Is there a specific payment query I can help clarify?"
    ]
  },
  { patterns: ['transport','bus','cab','travel','commute','vehicle'], context: 'campus',
    responses: [
      "The Transportation Hub shows real-time geospatial data of routes from student locations to KRMU. You can view your commute route on the Transportation page. Is there a specific transport concern?",
      "KRMU provides transportation services from major pickup points. Check the Transportation Portal for your nearest route and estimated distance."
    ]
  },
  { patterns: ['timetable','schedule','class','timing','when is'], context: 'campus',
    responses: [
      "Your class timetable is available in the Academics section. Key times: Morning batch 8AM-12PM, Afternoon batch 1PM-5PM. Would you like me to direct you to the full schedule?",
      "For your schedule, check the Academics tab where subject-wise timetables are displayed. Lab sessions are usually in the afternoon slots."
    ]
  },
  { patterns: ['library','book','borrow','return','resource'], context: 'campus',
    responses: [
      "KRMU Library has both physical and digital resources. The Admin panel tracks library book counts. For digital resources, the LMS section has course materials uploaded by faculty.",
      "Books can be borrowed from the library for up to 14 days. If you need a specific reference material, ask your faculty to upload it to the LMS portal."
    ]
  },
  // Greetings
  { patterns: ['hello','hi','hey','good morning','good afternoon','good evening','namaste'], context: 'greeting',
    responses: [
      "Hello! I'm ProjexaAI Assistant — your intelligent campus companion. I can help with mental health support, academic guidance, campus information, and more. How can I assist you today? 🎓",
      "Hey there! 👋 I'm here to support you through your academic journey. Whether it's exam prep, stress management, or campus queries — just ask!",
      "Namaste! 🙏 Welcome to ProjexaAI. I'm your smart campus assistant. What can I help you with today?"
    ]
  },
  { patterns: ['thank','thanks','thankyou','appreciate','helpful'], context: 'greeting',
    responses: [
      "You're very welcome! Remember, I'm always here whenever you need guidance. Take care of yourself! 💙",
      "Happy to help! Your wellbeing and academic success are what matter most. Don't hesitate to come back anytime. 🌟",
      "Anytime! Keep pushing forward — you've got this. 💪"
    ]
  },
  { patterns: ['who are you','what are you','your name','about you'], context: 'greeting',
    responses: [
      "I'm ProjexaAI Assistant — an AI-powered campus intelligence system built for KRMU students. I provide mental health support, academic guidance, and campus information using contextual memory to give you personalized responses.",
      "I'm your ProjexaAI companion! Think of me as a blend of an academic advisor, mental health support bot, and campus information assistant — all in one. 🤖"
    ]
  },
];

const getAIResponse = (message, context, history) => {
  const msg = message.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of chatKnowledgeBase) {
    // Context boost
    const contextBoost = (context && entry.context === context) ? 2 : 0;
    const matches = entry.patterns.filter(p => msg.includes(p)).length;
    const score = matches + contextBoost;
    if (score > bestScore) { bestScore = score; bestMatch = entry; }
  }

  if (bestMatch && bestScore > 0) {
    const idx = Math.floor(Math.random() * bestMatch.responses.length);
    return bestMatch.responses[idx];
  }

  // Fallback contextual responses
  if (context === 'mental_health') {
    const fallbacks = [
      "I'm here to support your mental wellbeing. Could you tell me more about what you're experiencing? Whether it's stress, focus issues, or anything else — we can work through it together.",
      "Your mental health matters deeply. Whatever you're going through, sharing it is the first step. What's on your mind right now?",
      "I want to help you navigate this. Can you describe what you're feeling or what situation you're dealing with? I'll provide the best guidance I can."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  const generalFallbacks = [
    "That's an interesting question! While my knowledge focuses on academic support, mental health, and campus guidance, I'll do my best. Could you rephrase or add more details?",
    "I'm still learning! For this specific query, I'd recommend checking with your faculty or the admin office. Is there something else I can help you with — exam prep, stress management, or campus info?",
    "I may not have a direct answer for that, but I'm here for mental health support, academic guidance, and campus FAQs. What area can I assist you in?"
  ];
  return generalFallbacks[Math.floor(Math.random() * generalFallbacks.length)];
};

app.post('/api/chat', (req, res) => {
  const { message, context, history = [] } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message required' });
  }
  // Simulate a small processing delay for realistic feel
  setTimeout(() => {
    const reply = getAIResponse(message, context, history);
    res.json({ reply, timestamp: new Date().toISOString() });
  }, 600 + Math.random() * 800);
});
// ─────────────────────────────────────────────────────────────────────────────

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
