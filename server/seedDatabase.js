const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const absolutePath = 'D:\\COLLEGE_KRMU\\SEMESTER 2\\MINOR PROJECT\\NEURAL NINJAS + BACKEND\\ProjexaAI\\data.db';
const db = new sqlite3.Database(absolutePath, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
    process.exit(1);
  }
  console.log("Connected to the SQLite database for seeding.");
});

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Sanya", "Kavya", "Diya", "Ananya", "Ishita", "Riya", "Aanya", "Priya", "Nisha", "Rohan"];
const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Patel", "Kumar", "Chopra", "Das", "Bose", "Mehta", "Reddy", "Nair", "Rao"];
const streams = ["B.Tech", "BBA", "MBA", "Law", "Pharmacy", "BCA"];
const classes = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

console.log("Beginning mass injection of 200 simulated student nodes...");

// We wrap inserts in a transaction for speed
db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    const stmt = db.prepare(`
        INSERT INTO students 
        (full_name, roll_no, email, password, stream, current_class, admission_date, account_status, profile_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', '')
    `);

    for (let i = 1; i <= 200; i++) {
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        const full_name = `${fn} ${ln}`;
        const roll_no = `KRMU-${Math.floor(100000 + Math.random() * 900000)}`;
        // Clean email without spaces, lowercase
        const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@krmu.edu.in`;
        const password = "password123";
        const stream = streams[Math.floor(Math.random() * streams.length)];
        const cur_class = classes[Math.floor(Math.random() * classes.length)];
        
        const yr = 2020 + Math.floor(Math.random() * 4);
        const mn = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const dy = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        const adm_date = `${yr}-${mn}-${dy}`;

        stmt.run([full_name, roll_no, email, password, stream, cur_class, adm_date], (err) => {
            if (err) console.error("Injection error:", err);
        });
    }

    stmt.finalize();
    db.run("COMMIT", () => {
        console.log("Successfully injected 200 mock students into data.db!");
        db.close();
    });
});
