import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const FeesFinance = () => {
    const [activeTab, setActiveTab] = useState('invoices');

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
                <button style={tabStyle('invoices')} onClick={() => setActiveTab('invoices')}>
                    <i className="fa-solid fa-file-invoice-dollar"></i> Open Invoices
                </button>
                <button style={tabStyle('transactions')} onClick={() => setActiveTab('transactions')}>
                    <i className="fa-solid fa-clock-rotate-left"></i> Transaction History
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'invoices' && (
                    <motion.div key="invoices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "15px", marginBottom: "15px" }}>
                            <div>
                                <h3 style={{ margin: 0, color: "white" }}>Semester 4 Tuition</h3>
                                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "5px 0" }}>Due by November 30th, 2023</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <h2 style={{ margin: 0, color: "#ef4444" }}>$4,250.00</h2>
                                <button className="btn btn-primary" style={{ marginTop: "10px", padding: "5px 15px" }}>Pay Now</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'transactions' && (
                    <motion.div key="transactions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card">
                        <h3>Cleared Ledger</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--glass-border)", color: "var(--text-muted)", textAlign: "left" }}>
                                    <th style={{ padding: "10px" }}>Date ID</th>
                                    <th style={{ padding: "10px" }}>Description</th>
                                    <th style={{ padding: "10px" }}>Amount</th>
                                    <th style={{ padding: "10px" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: "1px solid var(--glass-border)", color: "white" }}>
                                    <td style={{ padding: "15px 10px" }}>Aug 15, 2023</td>
                                    <td style={{ padding: "15px 10px" }}>Semester 3 Tuition Fee</td>
                                    <td style={{ padding: "15px 10px" }}>$4,250.00</td>
                                    <td style={{ padding: "15px 10px" }}><span className="badge badge-stable">Settled</span></td>
                                </tr>
                                <tr style={{ borderBottom: "1px solid var(--glass-border)", color: "white" }}>
                                    <td style={{ padding: "15px 10px" }}>Aug 15, 2023</td>
                                    <td style={{ padding: "15px 10px" }}>Library Fine Overdue</td>
                                    <td style={{ padding: "15px 10px" }}>$15.00</td>
                                    <td style={{ padding: "15px 10px" }}><span className="badge badge-stable">Settled</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default FeesFinance;