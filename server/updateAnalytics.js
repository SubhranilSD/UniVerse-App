const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const absolutePath = 'D:\\COLLEGE_KRMU\\SEMESTER 2\\MINOR PROJECT\\NEURAL NINJAS + BACKEND\\ProjexaAI\\data.db';
const db = new sqlite3.Database(absolutePath, (err) => {
  if (err) process.exit(1);
});

console.log("Beginning mathematical mass assignment of 4 unique subject metrics...");

db.all("SELECT id FROM students", [], (err, rows) => {
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        const stmt = db.prepare(`
            UPDATE students 
            SET marks_maths = ?, marks_ds = ?, marks_os = ?, marks_english = ?, gpa = ?,
                att_maths_att = ?, att_maths_tot = ?, 
                att_ds_att = ?, att_ds_tot = ?, 
                att_os_att = ?, att_os_tot = ?, 
                att_english_att = ?, att_english_tot = ?,
                attendance_pct = ?,
                latitude = ?,
                longitude = ?,
                tasks = ?,
                submissions = ?
            WHERE id = ?
        `);

        rows.forEach(student => {
            const marks = Array.from({length: 4}, () => Math.floor(40 + Math.random() * 60));
            const gpa = ((marks.reduce((a,b) => a+b, 0) / 400) * 10).toFixed(1);

            // Attendance seeding
            const attData = [];
            let totalAttended = 0;
            let totalPossible = 0;

            for(let i=0; i<4; i++) {
                const total = 20 + Math.floor(Math.random() * 10);
                const attended = Math.floor(total * (0.6 + Math.random() * 0.35));
                attData.push(attended, total);
                totalAttended += attended;
                totalPossible += total;
            }

            const overallPct = ((totalAttended / totalPossible) * 100).toFixed(1);
            
            // Random coordinates around College (28.52, 77.06)
            const lat = 28.52 + (Math.random() - 0.5) * 0.2;
            const lng = 77.06 + (Math.random() - 0.5) * 0.2;

            // Generate unique randomized tasks array per student
            const topics = ["ML Assignment", "DBMS Case Study", "System Design Doc", "React Integration", "Maths Homework", "Presentation Prep", "OS Threading Lab"];
            const taskTypes = ["Academic", "System", "Exam", "Comm", "Project"];
            const numTasks = Math.floor(Math.random() * 4) + 2; // 2 to 5 tasks
            const uniqueTasks = [];
            for (let i = 0; i < numTasks; i++) {
                uniqueTasks.push({
                    id: Date.now() + i * 1000 + Math.floor(Math.random() * 100),
                    text: topics[Math.floor(Math.random() * topics.length)],
                    priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
                    done: Math.random() > 0.6, // 40% chance done
                    type: taskTypes[Math.floor(Math.random() * taskTypes.length)]
                });
            }

            // Generate unique randomized submissions array per student
            const subTopics = ["Neural Networks Lab", "English Seminar Paper", "Web Dev Practicals", "Blockchain Analysis", "Data Mining Project"];
            const numSubs = Math.floor(Math.random() * 3) + 2;
            const uniqueSubs = [];
            for (let i = 0; i < numSubs; i++) {
                const prog = Math.floor(Math.random() * 100);
                uniqueSubs.push({
                    id: Date.now() + i * 1000 + Math.floor(Math.random() * 100),
                    title: subTopics[Math.floor(Math.random() * subTopics.length)],
                    deadline: ["Tonight, 11:59PM", "Tomorrow, 4:00PM", "Next week", "In 3 Days"][Math.floor(Math.random() * 4)],
                    progress: prog,
                    status: prog < 30 ? "Critical" : (prog > 80 ? "Upcoming" : "Pending")
                });
            }

            stmt.run([...marks, gpa, ...attData, overallPct, lat, lng, JSON.stringify(uniqueTasks), JSON.stringify(uniqueSubs), student.id]);
        });

        stmt.finalize();

        // Seed Curriculum
        console.log("Seeding Year-Long Curriculum Schedule...");
        db.run("DELETE FROM curriculum");
        const curriculumData = [
            // MONDAY (6 Classes)
            ['Mathematics II', 'Monday', '09:00 AM', '10:00 AM', 'Room 301'],
            ['Data Structures', 'Monday', '10:00 AM', '11:00 AM', 'Room 302'],
            ['Artificial Intelligence', 'Monday', '11:00 AM', '12:00 PM', 'Lab 4'],
            ['Operating Systems', 'Monday', '01:00 PM', '02:00 PM', 'Room 304'],
            ['Computer Networks', 'Monday', '02:00 PM', '03:00 PM', 'Room 305'],
            ['English', 'Monday', '03:00 PM', '04:00 PM', 'Room 102'],
            
            // TUESDAY (5 Classes)
            ['Database Management', 'Tuesday', '09:00 AM', '10:00 AM', 'Lab 2'],
            ['Operating Systems', 'Tuesday', '10:00 AM', '11:00 AM', 'Room 304'],
            ['English', 'Tuesday', '11:00 AM', '12:00 PM', 'Room 102'],
            ['Data Structures', 'Tuesday', '01:00 PM', '02:00 PM', 'Room 302'],
            ['Software Engineering', 'Tuesday', '02:00 PM', '03:30 PM', 'Room 201'],

            // WEDNESDAY (6 Classes)
            ['Mathematics II', 'Wednesday', '09:00 AM', '10:00 AM', 'Room 301'],
            ['Computer Networks', 'Wednesday', '10:00 AM', '11:00 AM', 'Room 305'],
            ['Data Structures', 'Wednesday', '11:00 AM', '12:00 PM', 'Lab 1'],
            ['Database Management', 'Wednesday', '01:00 PM', '02:00 PM', 'Lab 2'],
            ['Artificial Intelligence', 'Wednesday', '02:00 PM', '03:00 PM', 'Lab 4'],
            ['Machine Learning', 'Wednesday', '03:00 PM', '04:00 PM', 'Room 400'],

            // THURSDAY (4 Classes)
            ['Software Engineering', 'Thursday', '09:00 AM', '10:00 AM', 'Room 201'],
            ['Data Structures', 'Thursday', '10:00 AM', '11:30 AM', 'Room 302'],
            ['English', 'Thursday', '12:30 PM', '01:30 PM', 'Room 102'],
            ['Microprocessors', 'Thursday', '01:30 PM', '03:00 PM', 'Lab 3'],

            // FRIDAY (7 Classes)
            ['Operating Systems', 'Friday', '09:00 AM', '10:00 AM', 'Room 304'],
            ['Mathematics II', 'Friday', '10:00 AM', '11:00 AM', 'Room 301'],
            ['English', 'Friday', '11:00 AM', '12:00 PM', 'Room 102'],
            ['Artificial Intelligence', 'Friday', '01:00 PM', '02:00 PM', 'Lab 4'],
            ['Software Engineering', 'Friday', '02:00 PM', '03:00 PM', 'Room 201'],
            ['Database Management', 'Friday', '03:00 PM', '04:00 PM', 'Lab 2'],
            ['Computer Networks', 'Friday', '04:00 PM', '05:00 PM', 'Room 305']
        ];

        const currStmt = db.prepare("INSERT INTO curriculum (subject, day_of_week, start_time, end_time, room) VALUES (?, ?, ?, ?, ?)");
        curriculumData.forEach(row => currStmt.run(row));
        currStmt.finalize();

        db.run("COMMIT", () => {
            console.log("Analytics & Curriculum Reseeded Successfully!");
            db.close();
        });
    });
});
