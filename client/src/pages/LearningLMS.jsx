import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const LearningLMS = () => {
    const [activeTab, setActiveTab] = useState('modules');

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
                <button style={tabStyle('modules')} onClick={() => setActiveTab('modules')}>
                    <i className="fa-solid fa-boxes-stacked"></i> Course Modules
                </button>
                <button style={tabStyle('assignments')} onClick={() => setActiveTab('assignments')}>
                    <i className="fa-solid fa-file-arrow-up"></i> Assignments
                </button>
                <button style={tabStyle('grades')} onClick={() => setActiveTab('grades')}>
                    <i className="fa-solid fa-ranking-star"></i> LMS Grades
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'modules' && (
                    <motion.div key="modules" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid-2">
                        <div className="glass-card" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "20px" }}>
                            <div style={{width: "50px", height: "50px", background: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "white"}}>
                                <i className="fa-solid fa-code"></i>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: "white" }}>Data Structures</h3>
                                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "5px" }}>Module 4: Trees & Graphs</p>
                            </div>
                        </div>
                        <div className="glass-card" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "20px" }}>
                            <div style={{width: "50px", height: "50px", background: "#f59e0b", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "white"}}>
                                <i className="fa-solid fa-microchip"></i>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: "white" }}>Operating Systems</h3>
                                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "5px" }}>Module 2: Process Scheduling</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'assignments' && (
                    <motion.div key="assignments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="glass-card">
                            <h3>Pending Submissions</h3>
                            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
                                <div style={{ border: "1px dashed var(--glass-border)", padding: "20px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <h4 style={{ color: "white", margin: 0 }}>Binary Search Trees Mapping</h4>
                                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "5px" }}>Due in 2 days</p>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => alert("Upload dialog initialized.")}><i className="fa-solid fa-upload"></i> Upload</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'grades' && (
                    <motion.div key="grades" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card">
                        <h3>Internal Practical Grades</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--glass-border)", color: "var(--text-muted)", textAlign: "left" }}>
                                    <th style={{ padding: "10px" }}>Assignment</th>
                                    <th style={{ padding: "10px" }}>Course</th>
                                    <th style={{ padding: "10px" }}>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                                    <td style={{ padding: "15px 10px", color: "white" }}>Linked Lists Code Test</td>
                                    <td style={{ padding: "15px 10px", color: "var(--text-muted)" }}>Data Structures</td>
                                    <td style={{ padding: "15px 10px" }}><span className="badge badge-success">A (94%)</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default LearningLMS;