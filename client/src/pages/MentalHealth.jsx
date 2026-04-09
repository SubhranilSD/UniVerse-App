import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import AIChatBot from '../components/AIChatBot';

const MentalHealth = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [data, setData] = useState({ score: 0, status: 'Initializing...', metrics: { attendance: 0, gpa: 0, pending_assignments: 0 }, recommendations: [] });
    const [renderMap, setRenderMap] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('projexam_user');
        const user = stored ? JSON.parse(stored) : null;
        const studentId = user ? user.id : null;
        
        const url = studentId ? `/api/mental-health?studentId=${studentId}` : '/api/mental-health';
        
        fetch(url)
            .then(res => res.json())
            .then(resData => {
                setData(resData);
                setTimeout(() => setRenderMap(true), 500); // delay SVG render slightly
            })
            .catch(console.error);
    }, []);

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

    const circumference = (r) => 2 * Math.PI * r;

    return (
        <PageTransition>
            <div style={{ display: "flex", gap: "15px", marginBottom: "30px", overflowX: "auto" }}>
                <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>
                    <i className="fa-solid fa-microchip"></i> Diagnostics Engine
                </button>
                <button style={tabStyle('logs')} onClick={() => setActiveTab('logs')}>
                     <i className="fa-solid fa-server"></i> Sub-Routines
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                        
                        <div className="grid-2">
                            {/* Radial SVG Arc Reactor */}
                            <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "450px", position: "relative" }}>
                                <h3 style={{ position: "absolute", top: "20px", left: "20px", color: "var(--text-muted)" }}>SYS.COGNITIVE.LOAD</h3>
                                
                                <div style={{ position: "relative", width: "300px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {/* Central Score */}
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={renderMap ? { opacity: 1 } : {}}
                                        style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                    >
                                        <div style={{ fontSize: "3.5rem", fontWeight: "bold", color: data.score > 80 ? "#10b981" : data.score > 60 ? "#f59e0b" : "#ef4444", textShadow: `0 0 20px ${data.score > 80 ? "#10b981" : data.score > 60 ? "#f59e0b" : "#ef4444"}` }}>
                                            {data.score}
                                        </div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", letterSpacing: "2px" }}>OVERALL YIELD</div>
                                    </motion.div>

                                    {/* SVG Framework */}
                                    <svg width="300" height="300" viewBox="0 0 300 300" style={{ transform: "rotate(-90deg)" }}>
                                        {/* Background Track Rings */}
                                        <circle cx="150" cy="150" r="120" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                                        <circle cx="150" cy="150" r="95" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                                        <circle cx="150" cy="150" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />

                                        {/* Outer Ring: Attendance */}
                                        {renderMap && (
                                            <motion.circle
                                                cx="150" cy="150" r="120"
                                                fill="none" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round"
                                                strokeDasharray={circumference(120)}
                                                initial={{ strokeDashoffset: circumference(120) }}
                                                animate={{ strokeDashoffset: circumference(120) - ((data.metrics.attendance / 100) * circumference(120)) }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                                style={{ filter: "drop-shadow(0 0 8px #3b82f6)" }}
                                            />
                                        )}

                                        {/* Middle Ring: GPA */}
                                        {renderMap && (
                                            <motion.circle
                                                cx="150" cy="150" r="95"
                                                fill="none" stroke="#10b981" strokeWidth="12" strokeLinecap="round"
                                                strokeDasharray={circumference(95)}
                                                initial={{ strokeDashoffset: circumference(95) }}
                                                animate={{ strokeDashoffset: circumference(95) - (((data.metrics.gpa) / 10) * circumference(95)) }}
                                                transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                                                style={{ filter: "drop-shadow(0 0 8px #10b981)" }}
                                            />
                                        )}

                                        {/* Inner Ring: Tasks (Inverted! Lower is better) */}
                                        {renderMap && (
                                            <motion.circle
                                                cx="150" cy="150" r="70"
                                                fill="none" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round"
                                                strokeDasharray={circumference(70)}
                                                initial={{ strokeDashoffset: circumference(70) }}
                                                animate={{ strokeDashoffset: circumference(70) - (((5 - data.metrics.pending_assignments) / 5) * circumference(70)) }}
                                                transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
                                                style={{ filter: "drop-shadow(0 0 8px #f59e0b)" }}
                                            />
                                        )}
                                    </svg>
                                </div>
                                <div style={{ marginTop: "30px", fontWeight: "bold", letterSpacing: "1px", color: data.score > 80 ? "#10b981" : data.score > 60 ? "#f59e0b" : "#ef4444" }}>
                                    [ {data.status} ]
                                </div>
                            </div>

                            {/* Hyperdetailed Logistics Table */}
                            <div className="glass-card" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
                                    <div>
                                        <h3 style={{ margin: 0 }}>Neurometric Logistics Table</h3>
                                        <div style={{ fontSize: "0.7rem", color: "var(--secondary)", letterSpacing: "1px", fontWeight: "bold" }}>BASE STABILITY: 100.0 (SECURE)</div>
                                    </div>
                                    <div style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "monospace" }}>VERSION: LL.2.4-BETA</div>
                                </div>

                                <div style={{ overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                                        <thead>
                                            <tr style={{ background: "rgba(255,255,255,0.03)", color: "var(--text-muted)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                                <th style={{ padding: "12px", fontSize: "10px" }}>VECTOR ID</th>
                                                <th style={{ padding: "12px" }}>METRIC</th>
                                                <th style={{ padding: "12px" }}>TRIGGER</th>
                                                <th style={{ padding: "12px" }}>WEIGHT</th>
                                                <th style={{ padding: "12px" }}>RATIONALE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { id: "A-90", metric: "Attendance", current: `${data.metrics.attendance}%`, trigger: "< 90%", weight: "1.5x", rationale: "Structural routine breakdown penalty." },
                                                { id: "G-85", metric: "GPA Sync", current: `${data.metrics.gpa} GPA`, trigger: "< 8.5", weight: "6.0x", rationale: "Cognitive throughput deviation." },
                                                { id: "T-01", metric: "Tasks", current: data.metrics.pending_assignments, trigger: "> 0", weight: "-4.5", rationale: "Zeigarnik overhead strain." }
                                            ].map((row, i) => (
                                                <tr key={i} style={{ borderBottom: i === 2 ? "none" : "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                                                    <td style={{ padding: "15px 12px", fontFamily: "monospace", color: "var(--secondary)" }}>{row.id}</td>
                                                    <td style={{ padding: "15px 12px" }}>
                                                        <div style={{ color: "white", fontWeight: "bold" }}>{row.metric}</div>
                                                        <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>LIVE: {row.current}</div>
                                                    </td>
                                                    <td style={{ padding: "15px 12px", color: "#ef4444" }}>{row.trigger}</td>
                                                    <td style={{ padding: "15px 12px", color: "var(--warning)", fontWeight: "bold" }}>{row.weight}</td>
                                                    <td style={{ padding: "15px 12px", fontSize: "0.7rem", color: "var(--text-muted)", maxWidth: "120px" }}>{row.rationale}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ marginTop: "25px", background: "rgba(34, 211, 238, 0.05)", border: "1px solid rgba(34, 211, 238, 0.1)", padding: "15px", borderRadius: "8px" }}>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--secondary)", boxShadow: "0 0 10px var(--secondary)" }}></div>
                                        <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "white" }}>ALGORITHMIC SUMMARY</div>
                                    </div>
                                    <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                                        The final score is a non-linear deduction from the baseline. Severe deviations in Vector **G-85** (GPA) trigger exponential stability loss. Currently, your system is maintaining a **{data.score}%** yield efficiency based on cross-referenced telemetry.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}
                
                {activeTab === 'logs' && (
                    <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card">
                         <h3>Sub-Routine Protocols</h3>
                         <div style={{marginTop: "20px"}}>
                             {data.recommendations.map((rec, idx) => (
                                 <div key={idx} style={{ padding: "15px", background: "rgba(0,0,0,0.2)", marginBottom: "10px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "15px" }}>
                                     <i className="fa-solid fa-rotate text-gradient" style={{ animation: "spin 4s linear infinite" }}></i>
                                     <span style={{ color: "white", fontFamily: "monospace" }}>EXECUTING: {rec.title}</span>
                                 </div>
                             ))}
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Mental Health AI Companion ─── */}
            <AIChatBot
                context="mental_health"
                accentColor="#8b5cf6"
                title="Wellness Assistant"
                subtitle="Mental Health & Academic Support"
                welcomeMsg="Hi there 💜 I'm your ProjexaAI Wellness Assistant. I'm here to support you through stress, exam pressure, focus challenges, and more. How are you feeling today?"
            />
        </PageTransition>
    );
};

export default MentalHealth;