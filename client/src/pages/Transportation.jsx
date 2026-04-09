import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PageTransition from '../components/PageTransition';
import { Bus, Navigation, Activity, Zap, Shield, Search, RefreshCw, Map as MapIcon, Globe, Info } from 'lucide-react';

// fix for Leaflet marker icons in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom high-contrast icons for Satellite view
const hubIcon = L.divIcon({
    html: `<div style="background-color: #FFD700; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px #FFD700;"></div>`,
    className: 'custom-hub-icon',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const studentIcon = L.divIcon({
    html: `<div style="background-color: #22D3EE; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #22D3EE;"></div>`,
    className: 'custom-student-icon',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
});

const selectedIcon = L.divIcon({
    html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 20px #3b82f6; animation: marker-pulse 1.5s infinite;"></div>`,
    className: 'custom-selected-icon',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
});

// Map controller for cinematic camera
const MapController = ({ selectedStudent }) => {
    const map = useMap();
    useEffect(() => {
        if (selectedStudent) {
            map.flyTo([selectedStudent.latitude, selectedStudent.longitude], 14, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [selectedStudent, map]);
    return null;
};

const Transportation = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    
    // KRMU Hub Coordinates
    const hubPos = [28.3662, 77.0601];
    
    const satelliteUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    const labelUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch('/api/students');
                const data = await res.json();
                setStudents(data);
                setLoading(false);
            } catch (err) {
                console.error("Data Fetch Error:", err);
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await fetch('/api/transportation/sync', { method: 'POST' });
            const sRes = await fetch('/api/students');
            const sData = await sRes.json();
            setStudents(sData);
        } catch (err) {
            console.error("Sync Error:", err);
        } finally {
            setSyncing(false);
        }
    };

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
    };

    const filteredStudents = useMemo(() => {
        return students.filter(s => 
            s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.roll_no.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    return (
        <PageTransition>
            <div className="flex flex-col h-full gap-6 font-jakarta">
                {/* Header HUD */}
                <header className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter text-white flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                             <Globe className="text-indigo-400 animate-pulse" />
                           </div>
                           Real-Earth <span className="text-gold-premium italic">Transportation Portal</span>
                        </h2>
                        <p className="text-slate-400 mt-1 font-medium text-sm">Geospatial satellite synchronization. Data range: 1-150km.</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={handleSync}
                            disabled={syncing}
                            className={`glass-card group py-2 px-6 flex items-center gap-3 border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-500 ${syncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <RefreshCw size={18} className={`text-indigo-400 ${syncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                            <span className="text-sm font-bold text-indigo-100 uppercase tracking-widest">
                                {syncing ? 'REGENERATING...' : 'Neural Refresh'}
                            </span>
                        </button>
                        
                        <div className="glass-card py-2 px-6 flex items-center gap-4 border-emerald-500/30 bg-emerald-500/5">
                            <div className="text-right">
                                <div className="text-[10px] uppercase text-emerald-500/70 font-bold tracking-widest">Map Engine</div>
                                <div className="text-emerald-400 font-mono text-sm font-bold">ESRI SATELLITE LIVE</div>
                            </div>
                            <Activity className="text-emerald-400 animate-pulse" size={20} />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-6 h-[calc(100vh-220px)]">
                    {/* Satellite Leaflet Map Portal */}
                    <main className="col-span-9 glass-card p-0 overflow-hidden relative border-white/10 bg-slate-950/20 group shadow-2xl">
                        <MapContainer 
                            center={hubPos} 
                            zoom={10} 
                            zoomControl={false}
                            className="w-full h-full brightness-[0.8] contrast-[1.1]"
                        >
                            <TileLayer url={satelliteUrl} attribution='&copy; Esri World Imagery' />
                            <TileLayer url={labelUrl} opacity={0.6} />
                            <ZoomControl position="bottomright" />
                            <MapController selectedStudent={selectedStudent} />
                            
                            {/* Hub Marker */}
                            <Marker position={hubPos} icon={hubIcon}>
                                <Popup>
                                    <div className="p-2 font-bold text-indigo-600 font-jakarta">CENTRAL HUB: KRMU</div>
                                </Popup>
                            </Marker>

                            {/* Node Clusters */}
                            <MarkerClusterGroup chunkedLoading>
                                {filteredStudents.map((s) => (
                                    <Marker 
                                        key={s.id} 
                                        position={[s.latitude, s.longitude]} 
                                        icon={selectedStudent?.id === s.id ? selectedIcon : studentIcon}
                                        eventHandlers={{
                                            click: () => handleStudentSelect(s)
                                        }}
                                    >
                                        <Popup>
                                            <div className="p-3 bg-slate-900 text-white rounded-lg border border-white/10 font-jakarta">
                                                <div className="text-md font-bold text-indigo-400">{s.full_name}</div>
                                                <div className="text-[10px] text-slate-500 mb-1 font-bold">{s.roll_no}</div>
                                                <div className="text-xs font-black text-amber-500">DIST: {s.distance_km} KM</div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MarkerClusterGroup>

                            {/* Straight Line Route Layer */}
                            {selectedStudent && (
                                <Polyline 
                                    positions={[hubPos, [selectedStudent.latitude, selectedStudent.longitude]]} 
                                    pathOptions={{ 
                                        color: '#3b82f6', 
                                        weight: 4, 
                                        opacity: 0.9, 
                                        dashArray: '10, 10'
                                    }} 
                                />
                            )}
                        </MapContainer>
                        
                        {/* Selected Route HUD Overlay */}
                        {selectedStudent && (
                            <div className="absolute top-6 left-6 z-[1000] pointer-events-none">
                                <div className="glass-card p-4 flex items-center gap-4 bg-slate-950/80 border-indigo-500/30 shadow-3xl animate-in slide-in-from-left duration-500 font-jakarta">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                        <Navigation className="text-indigo-400" size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-black text-slate-500 tracking-widest leading-none mb-1">Active Neural Route</div>
                                        <div className="text-sm font-black text-white">{selectedStudent.full_name} <span className="text-indigo-400 ml-2">→</span> KRMU</div>
                                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter mt-1">DIRECT LINK VERIFIED</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center z-50 font-jakarta">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="w-20 h-20 border-t-2 border-indigo-500 rounded-full animate-spin shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
                                    <div className="text-center">
                                        <h3 className="text-white font-bold tracking-[0.3em] text-sm uppercase mb-1">Geospatial Hub</h3>
                                        <p className="text-slate-500 text-[10px] font-mono">ESTABLISHING NEURAL BRIDGE...</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Analytics Sidebar */}
                    <aside className="col-span-3 flex flex-col gap-6 overflow-hidden">
                        {/* Advanced Search Node */}
                        <div className="glass p-1 rounded-2xl border border-white/10 bg-slate-900/60 focus-within:border-indigo-500/50 transition-all font-jakarta shadow-xl">
                           <div className="relative">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                              <input 
                                type="text"
                                placeholder="Search Neural Nodes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none py-4 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none font-medium"
                              />
                           </div>
                        </div>

                        {/* Node List Monitoring */}
                        <div className="glass-card flex-1 flex flex-col min-h-0 bg-slate-900/40 p-5 border-white/5 shadow-inner font-jakarta">
                            <h4 className="text-[10px] font-black text-slate-500 mb-6 flex items-center justify-between uppercase tracking-widest">
                                <span className="flex items-center gap-2"><Shield size={14} className="text-indigo-400" /> Physical Node Monitor</span>
                                <span className="text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full">{filteredStudents.length} SYNCED</span>
                            </h4>
                            
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                {filteredStudents.slice(0, 100).map((s) => (
                                    <div 
                                        key={s.id} 
                                        onClick={() => handleStudentSelect(s)}
                                        className={`group flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 border cursor-pointer shadow-lg ${selectedStudent?.id === s.id ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/20'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black transition-all duration-300 border border-white/5 ${selectedStudent?.id === s.id ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'bg-slate-800 text-slate-400 group-hover:bg-indigo-500 group-hover:text-white'}`}>
                                            {s.full_name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[12px] font-black text-white truncate">{s.full_name}</div>
                                            <div className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">{s.roll_no}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-emerald-400 tracking-tighter">{s.distance_km} KM</div>
                                            <div className="text-[7px] font-black text-slate-700 uppercase tracking-tighter leading-none mt-1">DIRECT</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 font-jakarta">
                            <div className="glass p-4 rounded-2xl border border-white/5 bg-slate-900/60 transition-all hover:bg-slate-900/80">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Network Load</div>
                                <div className="text-2xl font-black text-emerald-400">84%</div>
                            </div>
                            <div className="glass p-4 rounded-2xl border border-white/5 bg-slate-900/60 transition-all hover:bg-slate-900/80">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Latency</div>
                                <div className="text-2xl font-black text-amber-500">0.05s</div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            <style jsx global>{`
                .leaflet-popup-content-wrapper {
                    background: rgba(11, 15, 26, 0.95);
                    color: white;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .leaflet-popup-tip {
                    background: rgba(11, 15, 26, 0.95);
                }
                .custom-hub-icon, .custom-student-icon, .custom-selected-icon {
                    background: none !important;
                    border: none !important;
                }
                @keyframes marker-pulse {
                    0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0px #3b82f6; }
                    50% { transform: scale(1.3); opacity: 0.8; box-shadow: 0 0 20px #3b82f6; }
                    100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0px #3b82f6; }
                }
            `}</style>
        </PageTransition>
    );
};

export default Transportation;
