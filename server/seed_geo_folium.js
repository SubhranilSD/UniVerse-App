const sqlite3 = require('sqlite3').verbose();

const dbPath = 'D:\\COLLEGE_KRMU\\SEMESTER 2\\MINOR PROJECT\\NEURAL NINJAS + BACKEND\\ProjexaAI\\data.db';
const db = new sqlite3.Database(dbPath);

const hubLat = 28.3662; 
const hubLng = 77.0601;

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

db.serialize(() => {
    console.log("Synthesizing Wide-Range Geospatial Nodes...");

    db.all("SELECT id FROM students", (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        const stmt = db.prepare("UPDATE students SET latitude = ?, longitude = ?, distance_km = ? WHERE id = ?");

        rows.forEach((row, i) => {
            // Distribute between 1km and 150km
            // Using a quadratic distribution for more realistic urban density
            const dist = 1 + (Math.random() * 149); 
            const theta = Math.random() * 2 * Math.PI;
            
            // Degrees to km approximation (1 deg ~ 111km)
            const dLat = (dist / 111) * Math.cos(theta);
            const dLng = (dist / (111 * Math.cos(hubLat * Math.PI / 180))) * Math.sin(theta);

            const lat = hubLat + dLat;
            const lng = hubLng + dLng;
            const actualDist = haversine(hubLat, hubLng, lat, lng);

            stmt.run(lat.toFixed(6), lng.toFixed(6), actualDist.toFixed(2), row.id);
        });

        stmt.finalize();
        console.log(`Neural Nodes successfully seeded for ${rows.length} units (Range: 1km - 150km).`);
        db.close();
    });
});
