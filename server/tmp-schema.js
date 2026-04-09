const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const db = new sqlite3.Database("D:\\COLLEGE_KRMU\\SEMESTER 2\\MINOR PROJECT\\NEURAL NINJAS + BACKEND\\ProjexaAI\\data.db");

let out = "";
db.all("PRAGMA table_info(profile)", (err, profile) => {
    out += "PROFILE:\n" + JSON.stringify(profile, null, 2) + "\n";
    db.all("PRAGMA table_info(students)", (err, students) => {
        out += "STUDENTS:\n" + JSON.stringify(students, null, 2) + "\n";
        fs.writeFileSync("schema_out.json", out);
        console.log("Wrote schema_out.json");
    });
});
