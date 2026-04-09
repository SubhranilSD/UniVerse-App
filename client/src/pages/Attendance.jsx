import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const Attendance = () => {
    const location = useLocation();
    const [targetBenchmark, setTargetBenchmark] = useState(75);
    const [studentData, setStudentData] = useState(null);
    const [curriculum, setCurriculum] = useState([]);
    const [loading, setLoading] = useState(true);

    const targetId = location.state?.impersonateId || JSON.parse(localStorage.getItem('projexam_user'))?.id || 1;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studRes, currRes] = await Promise.all([
                    fetch(`/api/students/${targetId}`),
                    fetch(`/api/curriculum`)
                ]);
                const studData = await studRes.json();
                const currData = await currRes.json();

                setStudentData(studData);
                setCurriculum(currData);
            } catch (err) {
                console.error("Fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [targetId]);

    const calculateNeeded = (attended, total, target) => {
        const needed = Math.ceil((target / 100 * total - attended) / (1 - target / 100));
        return needed > 0 ? needed : 0;
    };

    if (loading) return <div className="glass-card">Initializing Neural Attendance Matrix...</div>;

    const subjectAttendance = [
        { name: 'Mathematics II', att: studentData.att_maths_att, tot: studentData.att_maths_tot },
        { name: 'Data Structures', att: studentData.att_ds_att, tot: studentData.att_ds_tot },
        { name: 'Operating Systems', att: studentData.att_os_att, tot: studentData.att_os_tot },
        { name: 'English', att: studentData.att_english_att, tot: studentData.att_english_tot }
    ];

    const overallPct = subjectAttendance.reduce((acc, sub) => acc + (sub.att/sub.tot), 0) / 4 * 100;

    return (
        <PageTransition>
            <div className="attendance-header" style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <h2 style={{ fontSize: "2rem", marginBottom: "5px" }}>Attendance <span className="text-gradient">Intelligence</span></h2>
                    <p style={{ color: "var(--text-muted)" }}>Predictive rescue analytics for {studentData.full_name}</p>
                </div>
                <div className="glass-card" style={{ padding: "15px 25px", textAlign: "center", minWidth: "150px" }}>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px" }}>Current Aggregate</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: overallPct >= targetBenchmark ? "var(--success)" : "var(--error)" }}>
                        {overallPct.toFixed(1)}%
                    </div>
                </div>
            </div>

            <div className="grid-3" style={{ gap: "25px", marginBottom: "30px" }}>
                <div className="glass-card" style={{ gridColumn: "span 2", padding: "30px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                        <h3 style={{ margin: 0 }}>Strategic Target Adjustment</h3>
                        <span className="badge badge-primary">{targetBenchmark}% Benchmark</span>
                    </div>
                    <input 
                        type="range" 
                        min="60" max="100" 
                        value={targetBenchmark} 
                        onChange={(e) => setTargetBenchmark(parseInt(e.target.value))}
                        style={{ width: "100%", accentColor: "var(--primary)", height: "6px", borderRadius: "10px", cursor: "pointer" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "12px", color: "var(--text-muted)" }}>
                        <span>Minimum (60%)</span>
                        <span>Distinction (90%)</span>
                    </div>

                    <div style={{ marginTop: "40px" }}>
                        <h4 style={{ marginBottom: "20px", color: "var(--text-muted)" }}>Attendance Trajectory Gap</h4>
                        <div style={{ display: "flex", gap: "20px", alignItems: "flex-end", height: "150px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                            {subjectAttendance.map((sub, i) => {
                                const current = (sub.att / sub.tot) * 100;
                                return (
                                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                                        <div style={{ position: "relative", width: "100%", height: "100px", display: "flex", alignItems: "flex-end", gap: "4px" }}>
                                            {/* Current Bar */}
                                            <motion.div 
                                                initial={{ height: 0 }}
                                                animate={{ height: `${current}%` }}
                                                style={{ flex: 1, background: current >= targetBenchmark ? "var(--success)" : "var(--error)", borderRadius: "4px 4px 0 0", opacity: 0.8 }}
                                            />
                                            {/* Target Line (Ghost) */}
                                            <div style={{ position: "absolute", bottom: `${targetBenchmark}%`, left: 0, right: 0, height: "2px", background: "white", borderTop: "1px dashed rgba(255,255,255,0.5)", zIndex: 10 }}></div>
                                        </div>
                                        <span style={{ fontSize: "10px", color: "var(--text-muted)", textAlign: "center" }}>{sub.name.split(' ')[0]}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: "30px" }}>
                    <h3 style={{ marginBottom: "20px" }}>Status Protocol</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <div className={`priority-list-item ${overallPct < targetBenchmark ? 'border-error' : 'border-success'}`} style={{ borderLeft: "4px solid", padding: "15px", background: "rgba(0,0,0,0.2)" }}>
                            <div style={{ fontWeight: "600" }}>Debarment Risk</div>
                            <div style={{ fontSize: "12px", color: overallPct < targetBenchmark ? "var(--error)" : "var(--success)" }}>
                                {overallPct < targetBenchmark ? "CRITICAL: Under Target" : "STATUS: Safe Coverage"}
                            </div>
                        </div>
                        <div className="priority-list-item" style={{ borderLeft: "4px solid var(--primary)", padding: "15px", background: "rgba(0,0,0,0.2)" }}>
                            <div style={{ fontWeight: "600" }}>Next Assessment</div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>External Vivas in 14 days</div>
                        </div>
                        <div className="priority-list-item" style={{ borderLeft: "4px solid var(--warning)", padding: "15px", background: "rgba(0,0,0,0.2)" }}>
                            <div style={{ fontWeight: "600" }}>Automation</div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Last Sync: Just Now</div>
                        </div>
                    </div>
                </div>
            </div>

            <h3 style={{ marginBottom: "20px" }}><i className="fa-solid fa-table-list text-gradient"></i> Subject Strategy Matrix</h3>
            <div className="glass-card" style={{ padding: 0, overflow: "hidden", marginBottom: "40px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left", color: "var(--text-muted)", fontSize: "13px" }}>
                            <th style={{ padding: "15px 20px" }}>Module Name</th>
                            <th style={{ padding: "15px 20px" }}>Current Score</th>
                            <th style={{ padding: "15px 20px" }}>Gap to goal</th>
                            <th style={{ padding: "15px 20px" }}>Consecutive Classes Needed</th>
                            <th style={{ padding: "15px 20px" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjectAttendance.map((sub, i) => {
                            const current = (sub.att / sub.tot) * 100;
                            const needed = calculateNeeded(sub.att, sub.tot, targetBenchmark);
                            const nextClass = curriculum.find(c => c.subject === sub.name);
                            
                            return (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} className="hover-row">
                                    <td style={{ padding: "20px" }}>
                                        <div style={{ fontWeight: "600" }}>{sub.name}</div>
                                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Module ID: #{100 + i}</div>
                                    </td>
                                    <td style={{ padding: "20px" }}>
                                        <div style={{ fontWeight: "700", color: current >= targetBenchmark ? "var(--success)" : "var(--error)" }}>{current.toFixed(1)}%</div>
                                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{sub.att}/{sub.tot} Classes</div>
                                    </td>
                                    <td style={{ padding: "20px" }}>
                                        <span style={{ color: current < targetBenchmark ? "var(--error)" : "var(--success)" }}>
                                            {current < targetBenchmark ? `-${(targetBenchmark - current).toFixed(1)}%` : "Target Met"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "20px" }}>
                                        {needed > 0 ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--warning)" }}>
                                                <i className="fa-solid fa-triangle-exclamation"></i>
                                                <strong>{needed} Classes</strong>
                                            </div>
                                        ) : (
                                            <div style={{ color: "var(--success)" }}><i className="fa-solid fa-check-circle"></i> Sustainable</div>
                                        )}
                                    </td>
                                    <td style={{ padding: "20px" }}>
                                        <div style={{ fontSize: "12px" }}>
                                            <div style={{ fontWeight: "600" }}>Next: {nextClass?.day_of_week || 'N/A'}</div>
                                            <div style={{ color: "var(--text-muted)" }}>{nextClass?.start_time} • {nextClass?.room}</div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <h3 style={{ marginBottom: "20px" }}><i className="fa-solid fa-calendar-days text-gradient"></i> Year-Long Curriculum Schedule</h3>
            <div className="glass-card" style={{ padding: "30px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "15px" }}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                        <div key={day} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                            <div style={{ background: "rgba(255,255,255,0.05)", padding: "10px", textAlign: "center", fontWeight: "bold", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{day}</div>
                            <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                {curriculum.filter(c => c.day_of_week === day).map((item, idx) => (
                                    <div key={idx} style={{ padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", fontSize: "12px", borderLeft: `3px solid var(--primary)` }}>
                                        <div style={{ fontWeight: "bold" }}>{item.subject}</div>
                                        <div style={{ color: "var(--text-muted)", marginTop: "4px" }}>{item.start_time}</div>
                                        <div style={{ color: "var(--primary)", fontSize: "10px", marginTop: "2px" }}>{item.room}</div>
                                    </div>
                                ))}
                                {curriculum.filter(c => c.day_of_week === day).length === 0 && (
                                    <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "11px", padding: "20px 0" }}>No Classes</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px" }}>
                    <i className="fa-solid fa-info-circle"></i> This curriculum schedule is recurring for the academic year 2025-2026.
                </div>
            </div>
        </PageTransition>
    );
};

export default Attendance;