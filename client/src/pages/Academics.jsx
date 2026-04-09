import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const Academics = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('curriculum');
    const [curriculum, setCurriculum] = useState([]);
    const [performance, setPerformance] = useState(null);

    const targetId = location.state?.impersonateId || JSON.parse(localStorage.getItem('projexam_user'))?.id || 1;

    useEffect(() => {
        fetch('/api/curriculum').then(res => res.json()).then(setCurriculum).catch(console.error);
        fetch(`/api/students/${targetId}`).then(res => res.json()).then(setPerformance).catch(console.error);
    }, [targetId]);

    const tabStyle = (tabName) => ({
        padding: "10px 20px",
        background: activeTab === tabName ? "var(--primary)" : "rgba(255,255,255,0.05)",
        color: activeTab === tabName ? "white" : "var(--text-muted)",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "all 0.3s ease"
    });

    return (
        <PageTransition>
            <div style={{ display: "flex", gap: "15px", marginBottom: "30px", overflowX: "auto" }}>
                <button style={tabStyle('curriculum')} onClick={() => setActiveTab('curriculum')}>
                    <i className="fa-solid fa-book"></i> Curriculum Map
                </button>
                <button style={tabStyle('timetable')} onClick={() => setActiveTab('timetable')}>
                    <i className="fa-regular fa-calendar-days"></i> Master Timetable
                </button>
                <button style={tabStyle('credits')} onClick={() => setActiveTab('credits')}>
                    <i className="fa-solid fa-graduation-cap"></i> Credit History
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'curriculum' && (
                    <motion.div key="curriculum" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid-2">
                        <div className="glass-card">
                            <h3>Current Semester Courses</h3>
                            <ul style={{ listStyle: "none", padding: 0, marginTop: "15px" }}>
                                <li style={{ padding: "15px", background: "rgba(0,0,0,0.2)", marginBottom: "10px", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
                                    <span style={{color: "white", fontWeight: "bold"}}>CS301: Data Structures</span>
                                    <span className="badge badge-warning">4 Credits</span>
                                </li>
                                <li style={{ padding: "15px", background: "rgba(0,0,0,0.2)", marginBottom: "10px", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
                                    <span style={{color: "white", fontWeight: "bold"}}>CS302: Operating Systems</span>
                                    <span className="badge badge-warning">3 Credits</span>
                                </li>
                                <li style={{ padding: "15px", background: "rgba(0,0,0,0.2)", marginBottom: "10px", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
                                    <span style={{color: "white", fontWeight: "bold"}}>CS305: Artificial Intelligence</span>
                                    <span className="badge badge-warning">4 Credits</span>
                                </li>
                            </ul>
                        </div>
                        <div className="glass-card">
                            <h3>Syllabus Progress</h3>
                            <div style={{ marginTop: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "5px" }}>
                                    <span>CS301 Modules</span>
                                    <span>70%</span>
                                </div>
                                <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }}>
                                    <div style={{ width: "70%", height: "100%", background: "var(--primary)", borderRadius: "4px" }}></div>
                                </div>
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "5px" }}>
                                    <span>CS302 Modules</span>
                                    <span>45%</span>
                                </div>
                                <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }}>
                                    <div style={{ width: "45%", height: "100%", background: "#f59e0b", borderRadius: "4px" }}></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'timetable' && (
                    <motion.div key="timetable" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h3>Master Timetable</h3>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Academic Year 2025-2026</span>
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                                <div key={day} style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px", textAlign: "center", fontWeight: "bold", fontSize: "13px" }}>{day.substring(0,3)}</div>
                                    <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                        {curriculum.filter(c => c.day_of_week === day).map((item, idx) => (
                                            <div key={idx} style={{ padding: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "6px", fontSize: "11px", borderLeft: `2px solid var(--primary)` }}>
                                                <div style={{ fontWeight: "bold", color: "white" }}>{item.subject}</div>
                                                <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>{item.start_time}</div>
                                                <div style={{ color: "var(--primary)", fontSize: "9px" }}>{item.room}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'credits' && (
                    <motion.div key="credits" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid-3">
                        <div className="glass-card" style={{textAlign: "center"}}>
                            <h4 style={{color: "var(--text-muted)"}}>Total Earned</h4>
                            <div style={{fontSize: "2.5rem", fontWeight: "bold", color: "white", marginTop: "10px"}}>64</div>
                        </div>
                        <div className="glass-card" style={{textAlign: "center"}}>
                            <h4 style={{color: "var(--text-muted)"}}>Required to Graduate</h4>
                            <div style={{fontSize: "2.5rem", fontWeight: "bold", color: "white", marginTop: "10px"}}>120</div>
                        </div>
                        <div className="glass-card" style={{textAlign: "center"}}>
                            <h4 style={{color: "var(--text-muted)"}}>Current CGPA</h4>
                            <div style={{fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary)", marginTop: "10px"}}>{performance?.gpa || '0.0'}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default Academics;