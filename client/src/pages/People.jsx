import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const People = () => {
    const [activeTab, setActiveTab] = useState('directory');

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

    const mockStaff = [
        { name: "Dr. Alice Turing", role: "Head of AI Research", email: "alice@university.edu" },
        { name: "Prof. Alan Smith", role: "Data Structures Lecturer", email: "alan@university.edu" },
        { name: "Sarah Connor", role: "Placement Coordinator", email: "sarah.c@university.edu" }
    ];

    return (
        <PageTransition>
            <div style={{ display: "flex", gap: "15px", marginBottom: "30px", overflowX: "auto" }}>
                <button style={tabStyle('directory')} onClick={() => setActiveTab('directory')}>
                    <i className="fa-solid fa-address-book"></i> Faculty Directory
                </button>
                <button style={tabStyle('cohort')} onClick={() => setActiveTab('cohort')}>
                    <i className="fa-solid fa-users-viewfinder"></i> My Cohort
                </button>
                <button style={tabStyle('mentors')} onClick={() => setActiveTab('mentors')}>
                    <i className="fa-solid fa-chalkboard-user"></i> Assigned Mentors
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'directory' && (
                    <motion.div key="directory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid-3">
                        {mockStaff.map((staff, i) => (
                            <div key={i} className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                <div style={{ width: "60px", height: "60px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "white", marginBottom: "15px" }}>
                                    <i className="fa-regular fa-user"></i>
                                </div>
                                <h4 style={{ color: "white", margin: 0 }}>{staff.name}</h4>
                                <p style={{ color: "var(--primary)", fontSize: "0.85rem", margin: "5px 0 15px 0", fontWeight: "bold" }}>{staff.role}</p>
                                <button className="btn btn-ghost" style={{ width: "100%", padding: "8px" }} onClick={() => window.location.href=`mailto:${staff.email}`}>Message</button>
                            </div>
                        ))}
                    </motion.div>
                )}

                {activeTab === 'cohort' && (
                    <motion.div key="cohort" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card">
                        <h3>Semester 4 - Batch B</h3>
                        <p style={{ color: "var(--text-muted)", marginTop: "10px" }}>You are in a cohort of 42 students. (Full peer roster disabled for privacy until explicit consent).</p>
                    </motion.div>
                )}

                {activeTab === 'mentors' && (
                    <motion.div key="mentors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="glass-card" style={{ borderLeft: "4px solid var(--primary)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h3 style={{ color: "white" }}>Dr. Alice Turing</h3>
                                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "5px" }}>Academic Advisor</p>
                                </div>
                                <button className="btn btn-primary">Book Session</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default People;