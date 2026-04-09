const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = 'D:\\COLLEGE_KRMU\\SEMESTER 2\\MINOR PROJECT\\NEURAL NINJAS + BACKEND\\ProjexaAI\\data.db';
const db = new sqlite3.Database(dbPath);

// KRMU Hub (approximate)
const hubLat = 28.3662; 
const hubLng = 77.0601;

db.serialize(() => {
    console.log("Starting Geospatial Neural Synthesis...");

    db.all("SELECT id FROM students", (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        const stmt = db.prepare("UPDATE students SET latitude = ?, longitude = ? WHERE id = ?");

        rows.forEach((row, i) => {
            // Generate unique coords within ~15km radius
            const r = 0.15 * Math.sqrt(Math.random()); 
            const theta = Math.random() * 2 * Math.PI;
            
            const lat = hubLat + r * Math.cos(theta);
            const lng = hubLng + r * Math.sin(theta);

            stmt.run(lat.toFixed(6), lng.toFixed(6), row.id);
        });

        stmt.finalize();
        console.log(`Successfully synthesized unique coordinates for ${rows.length} neural nodes.`);
        db.close();
    });
});
