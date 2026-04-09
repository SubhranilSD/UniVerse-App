import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { 
    Clock, 
    Calendar, 
    CheckCircle2, 
    Circle, 
    FileText, 
    Briefcase, 
    TrendingUp, 
    AlertCircle,
    User,
    ArrowUpRight,
    MapPin,
    Users,
    Zap,
    Layout,
    Trash2,
    Plus
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Helper Component: Glowing Circular Progress (Pie Chart)
   ───────────────────────────────────────────────────────────── */
const CircularProgress = ({ value, max = 100, size = 60, strokeWidth = 6, color = "var(--primary)", label = "" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / max) * circumference;

    return (
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Track */}
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="transparent" stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress Circle with Glow */}
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="transparent" stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 5px ${color})` }}
                />
            </svg>
            <div style={{ position: 'absolute', fontSize: '0.75rem', fontWeight: '800', color: 'white' }}>
                {label || value}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Auth retrieval
    const savedSession = localStorage.getItem('projexam_user');
    const user = savedSession ? JSON.parse(savedSession) : { full_name: 'Administrator', roll_no: 'N/A' };
    const targetId = location.state?.impersonateId || user.id || 1;

    const [profileData, setProfileData] = useState({
        full_name: user.full_name,
        attendance_pct: 84.5,
        gpa: 8.6,
        pending_tasks: 2,
        profile_image: user.profile_image || ''
    });
    const [nextSession, setNextSession] = useState(null);
    const [curriculum, setCurriculum] = useState([]);
    const [todos, setTodos] = useState([
        { id: 1, text: "Finish ML Assignment", priority: "High", done: false, type: "Academic" },
        { id: 2, text: "Library Book Return", priority: "Low", done: true, type: "System" },
        { id: 3, text: "Prep for OS Quiz", priority: "Medium", done: false, type: "Exam" },
        { id: 4, text: "Contact Faculty for Project", priority: "Medium", done: false, type: "Comm" }
    ]);
    const [newTaskText, setNewTaskText] = useState("");
    const [showTaskInput, setShowTaskInput] = useState(false);

    const [submissions, setSubmissions] = useState([
        { id: 1, title: "Neural Networks Lab", deadline: "Tonight, 11:59PM", progress: 85, status: "Critical" },
        { id: 2, title: "DBMS Case Study", deadline: "Tomorrow, 4:00PM", progress: 40, status: "Pending" },
        { id: 3, title: "English Seminar Paper", deadline: "Apr 10", progress: 0, status: "Upcoming" }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studRes, currRes] = await Promise.all([
                    fetch(`/api/students/${targetId}`),
                    fetch(`/api/curriculum`)
                ]);
                const studData = await studRes.json();
                const currData = await currRes.json();
                setCurriculum(currData);

                if (studData && studData.full_name) {
                    setProfileData({
                        full_name: studData.full_name,
                        attendance_pct: studData.attendance_pct || 80.0,
                        gpa: studData.gpa || 8.0,
                        pending_tasks: studData.pending_tasks || 0,
                        profile_image: studData.profile_image || ''
                    });
                }

                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const currentDay = days[new Date().getDay()];
                const todayClasses = currData.filter(c => c.day_of_week === currentDay);
                
                if (todayClasses.length > 0) {
                    setNextSession({ ...todayClasses[0], teacher: "Dr. Sharma", credits: 4 });
                } else {
                    const nextDay = days[(new Date().getDay() + 1) % 7];
                    const tomorrowClasses = currData.filter(c => c.day_of_week === nextDay);
                    if (tomorrowClasses.length > 0) setNextSession({ ...tomorrowClasses[0], isTomorrow: true, teacher: "Prof. Gupta", credits: 3 });
                }

            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [targetId]);

    const toggleTodo = (id) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const addTodo = () => {
        if (newTaskText.trim() !== "") {
            setTodos([{ id: Date.now(), text: newTaskText, priority: "Medium", done: false, type: "User" }, ...todos]);
            setNewTaskText("");
            setShowTaskInput(false);
        }
    };

    const removeTodo = (id) => {
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Critical': return '#ef4444';
            case 'Pending': return '#f59e0b';
            case 'Upcoming': return '#3b82f6';
            default: return 'var(--text-muted)';
        }
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <PageTransition>
            <div style={{ maxWidth: '1050px', margin: '0 auto', paddingBottom: '40px' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: "40px" }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: profileData.profile_image ? `url(${profileData.profile_image}) center/cover` : 'var(--primary)', flexShrink: 0, boxShadow: '0 0 20px rgba(129, 140, 248, 0.3)', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {!profileData.profile_image && <User size={30} color="white" />}
                        </div>
                        <h2 style={{ fontSize: "2.4rem", marginBottom: "5px", fontWeight: "800", margin: 0 }}>
                            Systems ready, <span style={{ color: 'var(--secondary)', textShadow: '0 0 20px rgba(129, 140, 248, 0.7)' }}>{(profileData.full_name || 'User').split(' ')[0]}</span>
                        </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', color: "var(--text-muted)", fontSize: "0.95rem" }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Zap size={16} color="var(--secondary)" /> Optimal Operational Status
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={16} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>
                {location.state?.impersonateId && (
                    <div className="badge badge-warning" style={{ padding: '8px 12px', fontSize: '13px' }}>
                        <AlertCircle size={14} style={{ marginRight: '5px' }} /> ADMIN EMULATION ACTIVE
                    </div>
                )}
            </div>
            
            {/* Minimal Stats Row with Glowing Pie Charts */}
            <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: "50px" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
                {/* Attendance Card */}
                <motion.div 
                    onClick={() => navigate('/attendance')}
                    whileHover={{ boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)", borderColor: "#10b981", scale: 1.02 }}
                    className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.3s, transform 0.2s', cursor: 'pointer' }}
                >
                    <div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Attendance</div>
                        <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "white", marginTop: '2px' }}>{profileData.attendance_pct}%</div>
                        <div style={{ color: "#10b981", fontSize: "0.75rem", marginTop: '5px', fontWeight: 'bold' }}>Stable Node Flow</div>
                    </div>
                    <CircularProgress value={profileData.attendance_pct} color="#10b981" size={70} strokeWidth={7} />
                </motion.div>
                
                {/* CGPA Card */}
                <motion.div 
                    onClick={() => navigate('/exams-results')}
                    whileHover={{ boxShadow: "0 0 30px rgba(59, 130, 246, 0.2)", borderColor: "#3b82f6", scale: 1.02 }}
                    className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.3s, transform 0.2s', cursor: 'pointer' }}
                >
                    <div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Current GPA</div>
                        <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "white", marginTop: '2px' }}>{profileData.gpa}</div>
                        <div style={{ color: "#3b82f6", fontSize: "0.75rem", marginTop: '5px' }}>Top Tier Academic</div>
                    </div>
                    <CircularProgress value={profileData.gpa} max={10} color="#3b82f6" size={70} strokeWidth={7} label={profileData.gpa} />
                </motion.div>

                {/* Updates Card */}
                <motion.div 
                    onClick={() => navigate('/academics')}
                    whileHover={{ boxShadow: "0 0 30px rgba(239, 68, 68, 0.2)", borderColor: "#ef4444", scale: 1.02 }}
                    className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.3s, transform 0.2s', cursor: 'pointer' }}
                >
                    <div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase" }}>Pending Actions</div>
                        <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "white", marginTop: '2px' }}>0{profileData.pending_tasks}</div>
                        <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: '5px' }}>Sync Required</div>
                    </div>
                    <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 0 5px #ef4444)' }}>
                        <AlertCircle size={30} color="#ef4444" />
                    </div>
                </motion.div>
            </motion.div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 0.9fr)', gap: '40px', marginBottom: '40px' }}>
                
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    
                    {/* Next Classes Detailed */}
                    <div 
                        className="glass-card" 
                        style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                        onClick={() => document.getElementById('timetable')?.scrollIntoView({ behavior: 'smooth' })}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.3)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                                <Clock size={16} color="var(--primary)" /> Next Sync Session
                            </h3>
                            {nextSession && (
                                <span style={{ fontSize: '11px', fontWeight: '800', color: nextSession.isTomorrow ? 'var(--warning)' : '#10b981', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '10px' }}>
                                    {nextSession.isTomorrow ? 'TOMORROW' : 'IN PROGRESS'}
                                </span>
                            )}
                        </div>
                        <div style={{ padding: '20px 25px' }}>
                            {nextSession ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Subject</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{nextSession.subject}</div>
                                        <div style={{ display: 'flex', gap: '15px', marginTop: '12px' }}>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2px' }}>Room</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '600' }}><MapPin size={12} /> {nextSession.room}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2px' }}>Window</div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{nextSession.start_time} - {nextSession.end_time}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ paddingLeft: '20px', borderLeft: '1px solid rgba(255,255,255,0.02)' }}>
                                        <div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Faculty Node</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '600' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={14} />
                                                </div>
                                                {nextSession.teacher}
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '12px' }}>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2px' }}>Course Value</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{nextSession.credits} Credits · Neural Core</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ color: "var(--text-muted)", textAlign: 'center', padding: '10px' }}>No Sessions Found</div>
                            )}
                        </div>
                    </div>

                    {/* Minimal To-Do List */}
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Active Tasks</h3>
                            <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => setShowTaskInput(!showTaskInput)}>
                                {showTaskInput ? 'Cancel' : 'Create +'}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showTaskInput && (
                                <motion.div 
                                    key="task-input-wrapper"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ display: 'flex', gap: '10px', marginBottom: '15px', overflow: 'hidden' }}
                                >
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Enter task..." 
                                        value={newTaskText}
                                        onChange={(e) => setNewTaskText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                                        autoFocus
                                        style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                                    />
                                    <button className="btn btn-primary" onClick={addTodo} style={{ padding: '8px 15px' }}><Plus size={16} /></button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <AnimatePresence>
                                {todos.slice(0, 4).map(todo => (
                                    <motion.div 
                                        key={todo.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '12px', 
                                            padding: '10px 15px', 
                                            background: todo.done ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.04)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            opacity: todo.done ? 0.4 : 1,
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => toggleTodo(todo.id)}
                                    >
                                        {todo.done ? <CheckCircle2 color="#10b981" size={18} /> : <Circle color="rgba(255,255,255,0.2)" size={18} />}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{todo.text}</div>
                                        </div>
                                        <div style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                                            {todo.type}
                                        </div>
                                        <Trash2 
                                            size={16} 
                                            color="rgba(239, 68, 68, 0.6)" 
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => { e.stopPropagation(); removeTodo(todo.id); }}
                                            className="zoom-hover"
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    
                    {/* Minimal Submissions */}
                    <div className="glass-card">
                        <h3 style={{ marginBottom: "20px", fontSize: '1.1rem' }}>Submissions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {submissions.slice(0, 2).map(sub => (
                                <div key={sub.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(sub.status) }} />
                                            {sub.title}
                                        </div>
                                        <div style={{ color: "var(--text-muted)", fontSize: '0.75rem' }}>{sub.progress}%</div>
                                    </div>
                                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${sub.progress}%` }}
                                            style={{ height: '100%', background: getStatusColor(sub.status) }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ninja Insights - Extremely Sleek */}
                    <div className="glass-card" style={{ background: 'rgba(79, 70, 229, 0.05)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                        <h3 style={{ marginBottom: "12px", fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={16} color="var(--secondary)" /> Sync Insights
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.85rem' }}>
                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--secondary)' }} />
                                <p style={{ margin: 0 }}>Attendance track: <strong>On Schedule</strong></p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.85rem' }}>
                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--secondary)' }} />
                                <p style={{ margin: 0 }}>DBMS Efficiency: <strong>+18% Peak</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TIMETABLE SECTION - Minimalist Grid */}
            <div id="timetable" className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 25px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layout size={18} color="var(--secondary)" />
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Weekly Academic Synapse <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '400', marginLeft: '10px' }}>Mon - Fri Schedule</span></h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '15px 20px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem' }}>Time Cell</th>
                                {daysOfWeek.map(day => (
                                    <th key={day} style={{ padding: '15px 20px', textAlign: 'left', color: 'var(--text-main)', fontWeight: '800' }}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'].map((time, idx) => (
                                <tr key={time} style={{ borderBottom: idx === 3 ? 'none' : '1px solid rgba(255,255,255,0.02)' }}>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)', fontWeight: '600', background: 'rgba(255,255,255,0.01)' }}>{time}</td>
                                    {daysOfWeek.map(day => {
                                        const session = curriculum.find(c => c.day_of_week === day && c.start_time.includes(time.substring(0,2)));
                                        return (
                                            <td key={day} style={{ padding: '20px' }}>
                                                {session ? (
                                                    <motion.div 
                                                        whileHover={{ scale: 1.05, background: 'rgba(79, 70, 229, 0.15)' }}
                                                        style={{ 
                                                            padding: '10px 12px', 
                                                            background: 'rgba(255,255,255,0.03)', 
                                                            borderRadius: '8px', 
                                                            border: '1px solid rgba(255,255,255,0.05)',
                                                            cursor: 'pointer',
                                                            transition: 'background 0.3s'
                                                        }}
                                                    >
                                                        <div style={{ fontWeight: '800', color: 'white', marginBottom: '2px' }}>{session.subject}</div>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{session.room}</div>
                                                    </motion.div>
                                                ) : (
                                                    <div style={{ color: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: '800' }}>[ DISCONNECTED ]</div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        </PageTransition>
    );
};

export default Dashboard;