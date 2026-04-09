import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const Documents = () => {
    const [activeTab, setActiveTab] = useState('resources');

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
                <button style={tabStyle('resources')} onClick={() => setActiveTab('resources')}>
                    <i className="fa-solid fa-folder-open"></i> Global Resources
                </button>
                <button style={tabStyle('policies')} onClick={() => setActiveTab('policies')}>
                    <i className="fa-solid fa-gavel"></i> Academic Policies
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'resources' && (
                    <motion.div key="resources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid-3">
                        <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "15px", cursor: "pointer" }}>
                            <i className="fa-solid fa-file-pdf" style={{ fontSize: "2.5rem", color: "#ef4444" }}></i>
                            <div>
                                <h4 style={{ margin: 0, color: "white" }}>Campus Map.pdf</h4>
                                <p style={{ margin: "5px 0 0 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>2.4 MB</p>
                            </div>
                        </div>
                        <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "15px", cursor: "pointer" }}>
                            <i className="fa-solid fa-file-pdf" style={{ fontSize: "2.5rem", color: "#ef4444" }}></i>
                            <div>
                                <h4 style={{ margin: 0, color: "white" }}>Holiday Calendar</h4>
                                <p style={{ margin: "5px 0 0 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>1.1 MB</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'policies' && (
                    <motion.div key="policies" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card">
                         <h3>University Master Policies</h3>
                         <ul style={{ listStyle: "none", padding: 0, marginTop: "15px" }}>
                             <li style={{ padding: "10px", borderBottom: "1px solid var(--glass-border)", color: "var(--text-muted)" }}>
                                 <a href="#" style={{ color: "var(--primary)", fontWeight: "bold", textDecoration: "none" }}>Anti-Plagiarism Framework (v3.2)</a>
                             </li>
                             <li style={{ padding: "10px", borderBottom: "1px solid var(--glass-border)", color: "var(--text-muted)" }}>
                                 <a href="#" style={{ color: "var(--primary)", fontWeight: "bold", textDecoration: "none" }}>Hostel Accommodation Rules</a>
                             </li>
                             <li style={{ padding: "10px", borderBottom: "1px solid var(--glass-border)", color: "var(--text-muted)" }}>
                                 <a href="#" style={{ color: "var(--primary)", fontWeight: "bold", textDecoration: "none" }}>IT Acceptable Use Policy</a>
                             </li>
                         </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default Documents;