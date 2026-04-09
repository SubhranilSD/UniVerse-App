import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PageTransition from '../components/PageTransition';
import { Navigation, MapPin, User, Phone, Bus, ShieldCheck, Clock, Search, Layers, Globe } from 'lucide-react';

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const campusIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const homeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const KRMU_COORDS = [28.2712, 77.0679];

// Algorithm to generate exactly 208 students seamlessly to simulate school ERP database
const generateMockStudents = (count) => {
    const students = [
        { id: 1, name: "Rahul Sharma", roll: "REG-23145", dept: "B.Tech CSE", address: "Sector 82, Gurugram, Haryana", phone: "+91 98765-43210", coords: [28.3842, 76.9632], bus_no: "GN-04", pickup: "Vatika Town Square", driver: "Ashok Kumar (+91 91234-56789)" },
        { id: 2, name: "Ananya Das", roll: "REG-23146", dept: "BBA", address: "Sector 15, Faridabad, Haryana", phone: "+91 98765-43211", coords: [28.3896, 77.3090], bus_no: "FB-02", pickup: "Sec 15 Market", driver: "Pawan Singh (+91 91234-56780)" },
        { id: 3, name: "Priya Singh", roll: "REG-23147", dept: "BA LLB", address: "Vasant Kunj, New Delhi", phone: "+91 98765-43212", coords: [28.5292, 77.1622], bus_no: "DL-11", pickup: "Vasant Square Mall", driver: "Ramesh Yadav (+91 91234-56781)" }
    ];
    
    const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Diya", "Sanya", "Kavya", "Myra", "Aanya", "Pari", "Anika", "Navya", "Meera", "Riya"];
    const lastNames = ["Kumar", "Sharma", "Singh", "Gupta", "Verma", "Reddy", "Patil", "Desai", "Joshi", "Yadav", "Iyer", "Chauhan"];
    const depts = ["B.Tech CSE", "BBA", "BA LLB", "B.Sc Physics", "B.Com", "B.Arch"];

    for (let i = 4; i <= count; i++) {
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        // Scatter mostly North, East, and West towards Delhi NCR
        const lat = 28.2612 + (Math.random() * 0.4); 
        const lng = 77.0392 + ((Math.random() * 0.4) - 0.2); 
        
        students.push({
            id: i,
            name: `${fn} ${ln}`,
            roll: `REG-${23144 + i}`,
            dept: depts[Math.floor(Math.random() * depts.length)],
            address: "Delhi NCR Drop Zone",
            phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
            coords: [lat, lng],
            bus_no: `RT-${Math.floor(10 + Math.random() * 30)}`,
            pickup: `Zone Node ${Math.floor(1 + Math.random() * 50)}`,
            driver: `Route Cpt ${i} (+91 91230-00000)`
        });
    }
    return students;
};

const mockStudents = generateMockStudents(208);

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
     if(center) map.flyTo(center, 12, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

const TransportationHub = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mapMode, setMapMode] = useState('street'); // 'street' or 'earth'

    const fetchRoute = async (studentCoords) => {
        setLoading(true);
        try {
            // OSRM coordinates are formatted as {lon},{lat}
            const lon1 = studentCoords[1]; const lat1 = studentCoords[0];
            const lon2 = KRMU_COORDS[1]; const lat2 = KRMU_COORDS[0];
            
            const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`);
            const data = await response.json();
            
            if (data && data.routes && data.routes[0]) {
                const route = data.routes[0];
                const latLngs = route.geometry.coordinates.map(c => [c[1], c[0]]);
                setRouteData({
                    polyline: latLngs,
                    distance: (route.distance / 1000).toFixed(1), // km
                    duration: Math.round(route.duration / 60) // mins
                });
            }
        } catch (error) {
            console.error("OSRM Routing Error:", error);
        }
        setLoading(false);
    };

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        fetchRoute(student.coords);
    };

    const filteredStudents = mockStudents.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.roll.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

    return (
        <PageTransition>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(300px, 400px)', gap: '20px', height: 'calc(100vh - 120px)' }}>

                {/* LEFT PANEL - MAP */}
                <div className="glass-card" style={{ padding: '4px', overflow: 'hidden', position: 'relative' }}>
                    
                    {/* Map Mode Toggle Controls */}
                    <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.6)', padding: '5px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button 
                            onClick={() => setMapMode('street')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', transition: '0.3s', background: mapMode === 'street' ? 'var(--primary)' : 'transparent', color: mapMode === 'street' ? 'white' : 'var(--text-muted)' }}
                        >
                            <Layers size={16} /> Street Net
                        </button>
                        <button 
                            onClick={() => setMapMode('earth')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', transition: '0.3s', background: mapMode === 'earth' ? 'var(--secondary)' : 'transparent', color: mapMode === 'earth' ? 'white' : 'var(--text-muted)' }}
                        >
                            <Globe size={16} /> Earth View (True Color)
                        </button>
                    </div>

                    <MapContainer 
                        center={KRMU_COORDS} 
                        zoom={9} 
                        style={{ height: '100%', width: '100%', borderRadius: '12px', zIndex: 0 }}
                        zoomControl={false}
                    >
                        {/* Dynamic Tile Layer switching based on Map Mode */}
                        <TileLayer
                            key={mapMode}
                            url={mapMode === 'street' 
                                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
                                : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"}
                            attribution={mapMode === 'street' 
                                ? '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' 
                                : 'Tiles &copy; Esri &mdash; Source: Esri'}
                        />

                        {selectedStudent && <ChangeView center={[(KRMU_COORDS[0] + selectedStudent.coords[0])/2, (KRMU_COORDS[1] + selectedStudent.coords[1])/2]} />}

                        {/* Campus Marker */}
                        <Marker position={KRMU_COORDS} icon={campusIcon}>
                            <Tooltip permanent direction="top" offset={[0, -35]} className="custom-tooltip">
                                KRMU Campus Core
                            </Tooltip>
                        </Marker>

                        {/* Clusters */}
                        {!selectedStudent ? (
                            <MarkerClusterGroup chunkedLoading>
                                {filteredStudents.map(student => (
                                    <Marker key={student.id} position={student.coords} icon={homeIcon}>
                                        <Tooltip direction="top" offset={[0, -35]} className="custom-tooltip">
                                            {student.name}
                                        </Tooltip>
                                    </Marker>
                                ))}
                            </MarkerClusterGroup>
                        ) : (
                            <>
                                <Marker position={selectedStudent.coords} icon={homeIcon}>
                                    <Tooltip permanent direction="top" offset={[0, -35]} className="custom-tooltip">
                                        {selectedStudent.name}'s Home
                                    </Tooltip>
                                </Marker>
                                
                                {routeData && (
                                    <Polyline 
                                        positions={routeData.polyline} 
                                        color={mapMode === 'earth' ? "#10b981" : "#3b82f6"} // Green line on Earth view so it's visible, Blue on Street view 
                                        weight={6} 
                                        opacity={0.8}
                                        dashArray="10, 10"
                                    />
                                )}
                            </>
                        )}
                    </MapContainer>

                    {/* OVERLAYS OVER MAP */}
                    {loading && (
                        <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', padding: '10px 20px', borderRadius: '20px', zIndex: 1000, color: 'white', border: '1px solid var(--primary)', backdropFilter: 'blur(5px)' }}>
                            Generating OSRM Polyline Matrix...
                        </div>
                    )}

                    <AnimatePresence>
                        {routeData && selectedStudent && !loading && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                style={{ 
                                    position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', 
                                    background: 'rgba(15, 15, 20, 0.9)', padding: '20px', borderRadius: '16px', 
                                    zIndex: 1000, color: 'white', border: '1px solid rgba(255,255,255,0.1)', 
                                    backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                    display: 'flex', gap: '30px', minWidth: '400px', justifyContent: 'center'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: 45, height: 45, borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Routing Distance</span>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{routeData.distance} km</div>
                                    </div>
                                </div>
                                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: 45, height: 45, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Standard ETA</span>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{routeData.duration} Mins</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

                {/* RIGHT PANEL - ROSTER */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingLeft: '5px' }}>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <h2 style={{ margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem' }}><Navigation size={28} color="var(--primary)" /> Transport Intel</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time Student Logistics & Routing</p>
                    </div>

                    {!selectedStudent ? (
                        <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Student Roster</h3>
                                    <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>{filteredStudents.length} / 208 Logged</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 15px' }}>
                                    <Search size={16} color="var(--text-muted)" />
                                    <input 
                                        type="text" 
                                        placeholder="Search by name or roll no..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ background: 'transparent', border: 'none', color: 'white', padding: '0 10px', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
                                {filteredStudents.map(s => (
                                    <div key={s.id} onClick={() => handleStudentSelect(s)} 
                                         style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '15px' }}
                                         onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                         onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{ width: 45, height: 45, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                            {s.name[0]}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{s.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.roll} • {s.dept}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <button onClick={() => { setSelectedStudent(null); setRouteData(null); }} className="btn btn-ghost" style={{ marginBottom: '15px', padding: '5px 10px', fontSize: '0.8rem' }}>
                                    &larr; Back to Full Array
                                </button>
                                
                                <div className="glass-card" style={{ padding: '25px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}><ShieldCheck color="#10b981" size={24} /></div>
                                    
                                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '15px' }}>
                                        {selectedStudent.name[0]}
                                    </div>
                                    
                                    <h2 style={{ margin: '0 0 5px 0' }}>{selectedStudent.name}</h2>
                                    <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)' }}>{selectedStudent.roll} • {selectedStudent.dept}</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                                                <MapPin size={16} color="var(--primary)" style={{ marginTop: '2px' }} />
                                                <div>
                                                    <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px' }}>Home Location</span>
                                                    <span style={{ fontSize: '0.9rem' }}>{selectedStudent.address}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                <Phone size={16} color="var(--primary)" style={{ marginTop: '2px' }} />
                                                <div>
                                                    <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px' }}>Contact</span>
                                                    <span style={{ fontSize: '0.9rem' }}>{selectedStudent.phone}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                            <h4 style={{ margin: '0 0 10px 0', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}><Bus size={16} /> Allocated Transport</h4>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}><strong style={{ color: 'white' }}>Bus No:</strong> {selectedStudent.bus_no}</p>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}><strong style={{ color: 'white' }}>Pickup Point:</strong> {selectedStudent.pickup}</p>
                                            <p style={{ margin: '0', fontSize: '0.9rem' }}><strong style={{ color: 'white' }}>Driver:</strong> {selectedStudent.driver}</p>
                                            <span style={{ display: 'inline-block', marginTop: '10px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#10b981' }}>Live Tracking Near Active Node</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Injected styles for leaflet tooltips and clusters */}
            <style dangerouslySetInnerHTML={{__html: `
                .custom-tooltip {
                    background: rgba(0,0,0,0.8);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    font-weight: bold;
                    backdrop-filter: blur(5px);
                }
                .leaflet-tooltip-top:before {
                    border-top-color: rgba(0,0,0,0.8);
                }
            `}} />
        </PageTransition>
    );
};

export default TransportationHub;
