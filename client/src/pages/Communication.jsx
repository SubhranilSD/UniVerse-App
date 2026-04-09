import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AIChatBot from '../components/AIChatBot';
import AIChatInline from '../components/AIChatInline';

const announcements = [
    { id: 1, icon: '🌧', title: 'Campus Closed Tomorrow', body: 'Due to heavy rains and a Red Alert issued by the Meteorological Department, the campus will remain closed tomorrow. All classes are suspended.', date: 'Apr 5, 2026', tag: 'Urgent', tagColor: '#ef4444' },
    { id: 2, icon: '🎓', title: 'Guest Lecture – Dr. Alan on AI Ethics', body: 'Dr. Alan from IIT Delhi will deliver a guest lecture on Artificial Intelligence Ethics on Thursday at 11 AM in Auditorium A. Attendance is mandatory for CSE students.', date: 'Apr 4, 2026', tag: 'Academic', tagColor: '#6366f1' },
    { id: 3, icon: '💰', title: 'Fee Submission Deadline', body: 'Last date for semester fee submission is April 15, 2026. Late submission will incur a penalty of ₹500/day. Visit the Finance Office or pay online via the portal.', date: 'Apr 3, 2026', tag: 'Finance', tagColor: '#f59e0b' },
    { id: 4, icon: '📚', title: 'Mid-Semester Examination Schedule', body: 'Mid-semester examinations will be held from April 20 – April 28, 2026. The detailed schedule has been uploaded to the LMS. Please review and prepare accordingly.', date: 'Apr 2, 2026', tag: 'Exams', tagColor: '#10b981' },
    { id: 5, icon: '🏆', title: 'Tech Fest 2026 – Registrations Open', body: 'ProjexaTech Fest 2026 registrations are now open! Events include Hackathon, Robo Wars, Paper Presentation, and more. Last date to register: April 14, 2026.', date: 'Apr 1, 2026', tag: 'Events', tagColor: '#06b6d4' },
];

const Communication = () => {
    const [activeTab, setActiveTab] = useState('announcements');

    const tabStyle = (t) => ({
        padding: '9px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem',
        background: activeTab === t ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
        color: activeTab === t ? 'white' : 'var(--text-muted)',
        transition: 'all 0.25s',
        boxShadow: activeTab === t ? '0 4px 15px rgba(99,102,241,0.35)' : 'none',
    });

    return (
        <PageTransition>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: '2rem', marginBottom: 6 }}>Campus <span className="text-gradient">Communications</span></h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Announcements, circulars, and your AI campus assistant — all in one place.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                <button style={tabStyle('announcements')} onClick={() => setActiveTab('announcements')}>
                    <i className="fa-solid fa-bullhorn" style={{ marginRight: 7 }} />Announcements
                </button>
                <button style={tabStyle('noticeboard')} onClick={() => setActiveTab('noticeboard')}>
                    <i className="fa-solid fa-thumbtack" style={{ marginRight: 7 }} />Notice Board
                </button>
                <button style={tabStyle('assistant')} onClick={() => setActiveTab('assistant')}>
                    <i className="fa-solid fa-robot" style={{ marginRight: 7 }} />🤖 AI Assistant
                </button>
            </div>

            <AnimatePresence mode="wait">
                {/* Announcements */}
                {activeTab === 'announcements' && (
                    <motion.div key="announcements" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {announcements.map((a, i) => (
                            <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                                className="glass-card"
                                style={{ display: 'flex', gap: 18, alignItems: 'flex-start', padding: '20px 24px' }}
                            >
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                                    {a.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 800, color: 'white', fontSize: '1.02rem' }}>{a.title}</span>
                                        <span style={{ background: `${a.tagColor}20`, border: `1px solid ${a.tagColor}50`, color: a.tagColor, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{a.tag}</span>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{a.body}</p>
                                    <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>{a.date}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Notice Board */}
                {activeTab === 'noticeboard' && (
                    <motion.div key="noticeboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="glass-card">
                        <h3 style={{ marginBottom: 20 }}>Digital Notice Board</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                            {[
                                { color: '#f59e0b', icon: '📋', title: 'Exam Schedule', desc: 'Mid-sems: Apr 20–28' },
                                { color: '#6366f1', icon: '📖', title: 'Library Timings', desc: '9 AM – 8 PM Mon–Sat' },
                                { color: '#10b981', icon: '🏃', title: 'Sports Day', desc: 'April 30, Ground A' },
                                { color: '#06b6d4', icon: '💻', title: 'Lab Extension', desc: 'CS Lab open till 9 PM' },
                                { color: '#8b5cf6', icon: '🎓', title: 'Scholarship Apps', desc: 'Apply by April 20' },
                                { color: '#ef4444', icon: '🚐', title: 'Transport Update', desc: 'Route 3 rescheduled' },
                            ].map((n, i) => (
                                <motion.div key={i} whileHover={{ scale: 1.03, y: -3 }} style={{ padding: '18px 20px', background: `${n.color}10`, border: `1px solid ${n.color}30`, borderRadius: 14, cursor: 'pointer' }}>
                                    <div style={{ fontSize: 26, marginBottom: 10 }}>{n.icon}</div>
                                    <div style={{ fontWeight: 700, color: n.color, marginBottom: 4 }}>{n.title}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{n.desc}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Inline AI Assistant Tab */}
                {activeTab === 'assistant' && (
                    <motion.div key="assistant" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="glass-card" style={{ padding: 0, overflow: 'hidden', minHeight: 500 }}>
                        <AIChatInline
                            context="communication"
                            accentColor="#06b6d4"
                            title="Campus Assistant"
                            subtitle="Ask me anything about KRMU"
                            welcomeMsg="Hi! 👋 Ask me about class schedules, announcements, fees, exams, transport, library hours, or any campus query!"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Orb (other tabs) */}
            {activeTab !== 'assistant' && (
                <AIChatBot
                    context="communication"
                    accentColor="#06b6d4"
                    title="Campus Assistant"
                    subtitle="Announcements & Campus Info"
                    welcomeMsg="Hi! 👋 I'm your ProjexaAI Campus Assistant. Ask me about announcements, schedules, fees, transport, upcoming events, or anything campus-related!"
                />
            )}
        </PageTransition>
    );
};

export default Communication;