import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AreaChart, Area, BarChart, Bar, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line 
} from 'recharts';
import PageTransition from '../components/PageTransition';
import { 
    Brain, Target, Trophy, TrendingUp, Clock, AlertTriangle, 
    ChevronRight, BookOpen, Download, ShieldAlert, Award, Zap,
    Activity, Crosshair, BarChart2, Flame, CalendarDays, Play, CheckCircle2, Circle, MapPin, GraduationCap, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* --- MOCK AI ANALYTICS DATA --- */
const trendData = [
  { name: 'Test 1', score: 65, avg: 55 },
  { name: 'Test 2', score: 72, avg: 58 },
  { name: 'Test 3', score: 68, avg: 60 },
  { name: 'Test 4', score: 85, avg: 62 },
  { name: 'Test 5', score: 82, avg: 64 },
];

const subjectRadar = [
  { subject: 'Physics', A: 85, fullMark: 100 },
  { subject: 'Maths', A: 92, fullMark: 100 },
  { subject: 'English', A: 78, fullMark: 100 },
  { subject: 'Comp. Sci', A: 96, fullMark: 100 },
  { subject: 'Chemistry', A: 74, fullMark: 100 },
];

const timeData = [
  { name: 'Physics', value: 45, color: '#4f46e5' },
  { name: 'Maths', value: 60, color: '#10b981' },
  { name: 'Chemistry', value: 35, color: '#f59e0b' },
  { name: 'CS', value: 20, color: '#ec4899' },
];

const ExamsResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('upcoming'); // Default straight to the new upcoming dashboard
    const [analytics, setAnalytics] = useState(null);

    // Phase 3 Variables
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds for demo wow-factor
    const [syllabusChecks, setSyllabusChecks] = useState([false, false, false, false]);

    useEffect(() => {
        if (activeTab === 'upcoming' && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [activeTab, timeLeft]);

    const formatTime = (seconds) => {
        const d = Math.floor(seconds / (3600*24));
        const h = Math.floor(seconds % (3600*24) / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        const s = Math.floor(seconds % 60);
        return { d, h, m, s };
    };
    const t = formatTime(timeLeft);

    const handleDownloadICS = () => {
        const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Physics Mid Term Mission\nDESCRIPTION:Proctored CBT Examination via UniVerse Engine\nDTSTART:20260412T100000Z\nDTEND:20260412T110000Z\nLOCATION:Block A, IT Lab 3\nEND:VEVENT\nEND:VCALENDAR`;
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'Physics_Mission.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const targetId = location.state?.impersonateId || JSON.parse(localStorage.getItem('projexam_user'))?.id || 1;

    useEffect(() => {
        fetch(`/api/students/${targetId}`)
            .then(res => res.json())
            .then(data => {
                if(data.full_name) setAnalytics(data);
            }).catch(console.error);
    }, [targetId]);

    const getGrade = (mark) => {
        if (mark >= 90) return { label: 'A+', points: 10, color: 'var(--success)' };
        if (mark >= 80) return { label: 'A', points: 9, color: 'var(--success)' };
        if (mark >= 70) return { label: 'B+', points: 8, color: 'var(--primary)' };
        if (mark >= 60) return { label: 'B', points: 7, color: 'var(--warning)' };
        if (mark >= 50) return { label: 'C', points: 6, color: 'var(--warning)' };
        return { label: 'F', points: 0, color: 'var(--error)' };
    };

    const getInternalExternal = (totalMark) => {
        // Synthesizing a realistic split: Internal (max 40), External (max 60)
        // Usually, internal is proportionally slightly higher
        const intFactor = 0.42; 
        let internal = Math.min(40, Math.ceil(totalMark * intFactor));
        let external = totalMark - internal;
        if (external > 60) {
            internal += (external - 60);
            external = 60;
        }
        return { internal, external, total: totalMark };
    };

    const tabStyle = (tabName) => ({
        padding: "10px 20px",
        background: activeTab === tabName ? "var(--primary)" : "rgba(255,255,255,0.02)",
        color: activeTab === tabName ? "white" : "var(--text-muted)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "all 0.3s ease",
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ margin: 0, color: entry.color, fontSize: '0.85rem' }}>
                            {entry.name}: {entry.value}%
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <PageTransition>
            <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
                
                {/* Header Profile Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: "30px" }}>
                    <div>
                        <h2 style={{ fontSize: "2.4rem", marginBottom: "5px", fontWeight: "800", display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Activity size={36} color="var(--primary)" /> 
                            Deep Analytics Portal
                        </h2>
                        <p style={{ color: "var(--text-muted)", margin: 0 }}>Advanced neural testing diagnostics and peer ranking evaluation.</p>
                    </div>
                </div>

                {/* Sub Navigation */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "30px", overflowX: "auto" }}>
                    <button style={tabStyle('analytics')} onClick={() => setActiveTab('analytics')}>
                        <BarChart2 size={16} /> Deep Analytics & AI
                    </button>
                    <button style={tabStyle('upcoming')} onClick={() => setActiveTab('upcoming')}>
                        <Target size={16} /> Future Briefings <span style={{ background: 'var(--error)', padding: '2px 6px', borderRadius: '10px', fontSize: '0.65rem', marginLeft: '5px' }}>2 LIVE</span>
                    </button>
                    <button style={tabStyle('vault')} onClick={() => setActiveTab('vault')}>
                        <BookOpen size={16} /> Archives & Vault
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'analytics' && (
                        <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            
                            {/* OVERVIEW STATS ROW */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
                                <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Award size={80} /></div>
                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Latest Score</h4>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                        <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>82<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/100</span></span>
                                    </div>
                                    <p style={{ margin: 0, color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><TrendingUp size={14} /> +12% from average</p>
                                </div>
                                <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Trophy size={80} /></div>
                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Class Rank</h4>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                        <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>5<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>th</span></span>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600' }}>Percentile: 94.2ile</p>
                                </div>
                                <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Crosshair size={80} /></div>
                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Accuracy Rate</h4>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                        <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>89%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '10px' }}>
                                        <div style={{ width: '89%', height: '100%', background: '#3b82f6', borderRadius: '2px', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }} />
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Clock size={80} /></div>
                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Time Economics</h4>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                        <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>1m 12s</span>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Average per question</p>
                                </div>
                            </div>

                            {/* GRAPHS GRID */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                
                                {/* Trajectory Graph */}
                                <div className="glass-card" style={{ padding: '20px' }}>
                                    <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Activity size={18} color="var(--primary)" /> Performance Trajectory
                                    </h3>
                                    <div style={{ width: '100%', height: '300px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area type="monotone" dataKey="score" name="Your Score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                                <Area type="monotone" dataKey="avg" name="Class Average" stroke="rgba(255,255,255,0.2)" strokeWidth={2} fillOpacity={0} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Subject Radar */}
                                <div className="glass-card" style={{ padding: '20px' }}>
                                    <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Target size={18} color="var(--secondary)" /> Proficiency Radar
                                    </h3>
                                    <div style={{ width: '100%', height: '300px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={subjectRadar}>
                                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar name="Student" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.3} />
                                                <Tooltip content={<CustomTooltip />} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* AI MENTOR & LEADERBOARD GRID */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '20px' }}>
                                
                                {/* AI Smart Result Insights */}
                                <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', padding: '1px' }}>
                                    {/* Animated Gradient Border */}
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, var(--primary), var(--secondary), transparent)', zIndex: 0, opacity: 0.3 }} />
                                    <div style={{ background: 'var(--bg-layer-2)', width: '100%', height: '100%', position: 'relative', zIndex: 1, padding: '25px', borderRadius: 'inherit' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                                                <Brain size={20} color="var(--secondary)" /> AI Exam Mentor
                                            </h3>
                                            <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>NEURAL DIAGNOSIS ACTIVE</span>
                                        </div>
                                        
                                        <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '20px' }}>
                                            "Your accuracy drops by <strong>18%</strong> in physics numericals after the 40-minute mark. This indicates a speed-stamina issue. Focus on time curation during mid-exam phases."
                                        </p>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '15px', borderRadius: '8px' }}>
                                                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldAlert size={14} /> Critical Weaknesses</h4>
                                                <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                                                    <li>Rotational Motion (25% Acc)</li>
                                                    <li>Thermodynamics (33% Acc)</li>
                                                    <li>Integration limits</li>
                                                </ul>
                                            </div>
                                            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '15px', borderRadius: '8px' }}>
                                                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={14} /> Recommended Action</h4>
                                                <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                                                    <li>Launch Rotational Practice Set alpha</li>
                                                    <li>Review Mechanics formulae</li>
                                                    <li>Try 30-min burst sessions</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}><Zap size={16} /> GENERATE REMEDIAL TEST SESSION</button>
                                    </div>
                                </div>

                                {/* Gamified Leaderboard */}
                                <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Trophy size={18} color="var(--warning)" /> Competitive Standing
                                        </h3>
                                    </div>
                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        
                                        {/* Ranks */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Campus Rank</span>
                                            <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}><ArrowUpIcon color="#10b981" /> 42 / 1200</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>City/Regional Rank</span>
                                            <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}><ArrowUpIcon color="#10b981" /> 845 / 45K</span>
                                        </div>

                                        {/* Gamification Badges */}
                                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginTop: '10px', marginBottom: '5px' }}>Unlocked Achievements</h4>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <motion.div whileHover={{ scale: 1.1 }} style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'bold', cursor: 'pointer' }}>
                                                <Flame size={14} /> 7 Day Streak
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.1 }} style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer' }}>
                                                <Zap size={14} /> Fast Solver
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.1 }} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold', cursor: 'pointer' }}>
                                                <Target size={14} /> Concept Master
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DETAILED SEMESTER TRANSCRIPT */}
                            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginTop: '20px' }}>
                                <div style={{ padding: '20px 25px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <BookOpen size={18} color="var(--primary)" /> Detailed Semester Transcript
                                    </h3>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Semester: <strong style={{ color: 'white' }}>Spring 2026</strong></div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SGPA: <strong style={{ color: 'var(--secondary)', fontSize: '1rem' }}>{analytics?.gpa || '8.6'}</strong></div>
                                    </div>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <th style={{ padding: '15px 20px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem' }}>Course Code</th>
                                                <th style={{ padding: '15px 20px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem' }}>Subject Designation</th>
                                                <th style={{ padding: '15px 20px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem' }}>Internals (40)</th>
                                                <th style={{ padding: '15px 20px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem' }}>Externals (60)</th>
                                                <th style={{ padding: '15px 20px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem' }}>Total (100)</th>
                                                <th style={{ padding: '15px 20px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem' }}>Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { code: 'MA201', name: 'Mathematics II', mark: analytics?.marks_maths || 82, credits: 4 },
                                                { code: 'CS301', name: 'Data Structures', mark: analytics?.marks_ds || 65, credits: 4 },
                                                { code: 'CS302', name: 'Operating Systems', mark: analytics?.marks_os || 68, credits: 3 },
                                                { code: 'HS101', name: 'Professional English', mark: analytics?.marks_english || 85, credits: 2 }
                                            ].map((row, idx, arr) => {
                                                const grade = getGrade(row.mark);
                                                const split = getInternalExternal(row.mark);
                                                return (
                                                    <tr key={row.code} style={{ borderBottom: idx === arr.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                                                        <td style={{ padding: '15px 20px', fontWeight: '800', color: 'var(--primary)', background: 'rgba(255,255,255,0.01)' }}>{row.code}</td>
                                                        <td style={{ padding: '15px 20px', fontWeight: '600', color: 'white' }}>{row.name} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '10px' }}>{row.credits} Cr</span></td>
                                                        
                                                        {/* Internals */}
                                                        <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                                {split.internal}
                                                                <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                                                    <div style={{ width: `${(split.internal / 40) * 100}%`, height: '100%', background: 'var(--secondary)', borderRadius: '2px' }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        
                                                        {/* Externals */}
                                                        <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                                {split.external}
                                                                <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                                                    <div style={{ width: `${(split.external / 60) * 100}%`, height: '100%', background: '#f59e0b', borderRadius: '2px' }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        
                                                        {/* Total */}
                                                        <td style={{ padding: '15px 20px', textAlign: 'center', fontWeight: '800', fontSize: '1rem', color: 'white' }}>{split.total}</td>
                                                        
                                                        {/* Grade */}
                                                        <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                                            <span style={{ 
                                                                background: `rgba(${grade.color === 'var(--success)' ? '16,185,129' : grade.color === 'var(--primary)' ? '59,130,246' : grade.color === 'var(--warning)' ? '245,158,11' : '239,68,68'}, 0.1)`, 
                                                                color: grade.color, 
                                                                border: `1px solid ${grade.color}`,
                                                                padding: '4px 12px',
                                                                borderRadius: '4px',
                                                                fontWeight: '900',
                                                                textShadow: `0 0 10px ${grade.color}`
                                                            }}>
                                                                {grade.label}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'upcoming' && (
                        <motion.div key="upcoming" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
                                
                                {/* MAIN EXAM CARD */}
                                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', padding: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>ONLINE CBT</span>
                                                <h2 style={{ fontSize: '2.2rem', margin: '15px 0 5px 0' }}>Physics Mid Term</h2>
                                                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><GraduationCap size={18} /> Department of Applied Sciences</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ color: 'var(--error)', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end', letterSpacing: '1px' }}>
                                                    <Flame size={16} /> EXTREME DIFFICULTY
                                                </div>
                                                <h3 style={{ fontSize: '1.8rem', margin: '10px 0 0 0' }}>50 Marks</h3>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)' }}>
                                        <div style={{ background: 'var(--bg-layer-2)', padding: '20px' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px' }}>Date & Time</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>12 April • 10:00 AM</div>
                                        </div>
                                        <div style={{ background: 'var(--bg-layer-2)', padding: '20px' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px' }}>Duration</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>60 Minutes</div>
                                        </div>
                                        <div style={{ background: 'var(--bg-layer-2)', padding: '20px' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px' }}>Negative Marking</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#f59e0b' }}>-0.25 Per Error</div>
                                        </div>
                                        <div style={{ background: 'var(--bg-layer-2)', padding: '20px' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px' }}>Chapters Covered</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>4 Chapters</div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '30px' }}>
                                        <h3 style={{ margin: '0 0 15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Search size={18} color="var(--primary)" /> Syllabus Validation Checklist
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {['Rotational Mechanics', 'Fluid Dynamics', 'Thermodynamics Core', 'Wave Optics'].map((chap, i) => (
                                                <div key={i} onClick={() => { const ns = [...syllabusChecks]; ns[i] = !ns[i]; setSyllabusChecks(ns); }} 
                                                     style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: syllabusChecks[i] ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)', border: syllabusChecks[i] ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
                                                    {syllabusChecks[i] ? <CheckCircle2 color="#10b981" /> : <Circle color="var(--text-muted)" />}
                                                    <span style={{ color: syllabusChecks[i] ? 'white' : 'var(--text-muted)', textDecoration: syllabusChecks[i] ? 'line-through' : 'none', fontWeight: syllabusChecks[i] ? 'bold' : 'normal' }}>{chap}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* SIDEBAR WIDGETS */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {/* COUNTDOWN WIDGET */}
                                    <div className="glass-card" style={{ padding: '25px', textAlign: 'center', borderTop: '3px solid var(--secondary)' }}>
                                        <h4 style={{ color: 'var(--text-muted)', margin: '0 0 15px 0', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Mission T-Minus</h4>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 5px', borderRadius: '8px', minWidth: '55px' }}>
                                                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'white' }}>{t.d.toString().padStart(2, '0')}</div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Days</div>
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 5px', borderRadius: '8px', minWidth: '55px' }}>
                                                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'white' }}>{t.h.toString().padStart(2, '0')}</div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hrs</div>
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 5px', borderRadius: '8px', minWidth: '55px' }}>
                                                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'white' }}>{t.m.toString().padStart(2, '0')}</div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Min</div>
                                            </div>
                                            <div style={{ background: 'rgba(59,130,246,0.1)', padding: '10px 5px', borderRadius: '8px', minWidth: '55px', border: '1px solid rgba(59,130,246,0.3)' }}>
                                                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#3b82f6' }}>{t.s.toString().padStart(2, '0')}</div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Sec</div>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn btn-primary" 
                                            disabled={timeLeft > 0} 
                                            onClick={() => navigate('/online-tests')}
                                            style={{ width: '100%', padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: timeLeft > 0 ? 0.5 : 1, fontWeight: 'bold' }}
                                        >
                                            {timeLeft > 0 ? <><Clock size={18} /> AWAITING CLEARANCE</> : <><Play size={18} /> ENTER LIVE ENGINE</>}
                                        </button>
                                        <div style={{ marginTop: '15px' }}>
                                            <button onClick={() => setTimeLeft(0)} className="btn btn-ghost" style={{ fontSize: '0.7rem', padding: '5px 10px', color: 'var(--text-muted)' }}>[Dev Tool: Force Unlock]</button>
                                        </div>
                                    </div>

                                    {/* LOGISTICS WIDGET */}
                                    <div className="glass-card" style={{ padding: '25px' }}>
                                        <h4 style={{ margin: '0 0 15px 0' }}>Mission Logistics</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <button onClick={handleDownloadICS} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <CalendarDays size={16} /> Add to Calendar (.ics)
                                            </button>
                                            <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }} onClick={() => alert("Admit Card Security Validation Passed! Seat: A-402")}>
                                                <Download size={16} /> Download Admit Card
                                            </button>
                                        </div>
                                        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.75rem', letterSpacing: '1px' }}>
                                                <MapPin size={14} /> SEAT ALLOCATION
                                            </div>
                                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.05rem' }}>Block A, IT Lab 3</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>System Terminal #42</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'vault' && (
                        <motion.div key="vault" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card" style={{ textAlign: 'center', padding: '50px' }}>
                            <BookOpen size={48} color="var(--secondary)" style={{ margin: '0 auto 20px auto', opacity: 0.5 }} />
                            <h3>Archives & Vault Offline</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Previous year papers and downloads will be synchronized shortly.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

// Mini helper for Arrow
const ArrowUpIcon = ({ color }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
);

export default ExamsResults;