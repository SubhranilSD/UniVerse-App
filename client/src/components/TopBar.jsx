import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Navigation } from 'lucide-react';

const topBarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const SEARCH_INDEX = [
    { title: 'Dashboard', url: '/dashboard', keywords: 'home main overview stats portal' },
    { title: 'Smart Campus', url: '/smart-campus', keywords: 'map transportation routes tracking bus live' },
    { title: 'Academics', url: '/academics', keywords: 'timetable syllabus subjects classes' },
    { title: 'Attendance', url: '/attendance', keywords: 'presence absent proxy tracking graph' },
    { title: 'Online Engine / Exams', url: '/online-tests', keywords: 'exam test mcq diagnostics attempt rank' },
    { title: 'Exams & Results', url: '/exams-results', keywords: 'marks grades gpa transcript internal external' },
    { title: 'Fees & Finance', url: '/fees-finance', keywords: 'money payment challan bill pending due' },
    { title: 'Fees & Finance', url: '/fees-finance', keywords: 'money payment challan bill pending due' },
    { title: 'Profile', url: '/profile', keywords: 'user settings account security password preferences notify' },
    { title: 'Learning LMS', url: '/learning-lms', keywords: 'predictive ai tutorial study notes resources' },
    { title: 'Transportation Intel', url: '/transportation-intelligence', keywords: 'bus route logistics eta mapping gps map' }
];

const TopBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('projexam_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, [location.pathname]);

    const titles = {
        '/dashboard': 'Dashboard',
        '/smart-campus': 'Smart Campus',
        '/academics': 'Academics',
        '/people': 'People',
        '/learning-lms': 'Learning (LMS)',
        '/mental-health': 'Mental Health',
        '/predictive-learning': 'Predictive Learning',
        '/attendance': 'Attendance',
        '/exams-results': 'Exams & Results',
        '/fees-finance': 'Fees & Finance',
        '/communication': 'Communication',
        '/requests': 'Requests',
        '/reports': 'Reports',
        '/documents': 'Documents',
        '/settings': 'Settings',
        '/profile': 'Profile',
        '/admin': 'Admin Panel',
        '/online-tests': 'Online Diagnostic Engine'
    };

    const currentTitle = titles[location.pathname] || 'ProjexaAI';

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.trim().length > 0) {
            const lowerQuery = query.toLowerCase();
            const results = SEARCH_INDEX.filter(item => 
                item.title.toLowerCase().includes(lowerQuery) || 
                item.keywords.includes(lowerQuery)
            ).slice(0, 5);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };
    
    const handleResultClick = (url) => {
        setSearchQuery('');
        setSearchResults([]);
        setIsFocused(false);
        navigate(url);
    };

    return (
        <motion.div 
            className="top-bar"
            initial="hidden"
            animate="visible"
            variants={topBarVariants}
        >
            <div>
                <h2 style={{ margin: 0 }}>{currentTitle}</h2>
                <p style={{ margin: 0, fontSize: '14px' }}>Welcome back, {user ? user.full_name : 'Student'}</p>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <motion.div style={{ position: 'relative' }}>
                    <div style={{ 
                        display: 'flex', alignItems: 'center', 
                        background: isFocused ? 'rgba(255,255,255,0.08)' : 'var(--bg-layer-2)', 
                        border: isFocused ? '1px solid var(--primary)' : '1px solid var(--glass-border)', 
                        boxShadow: isFocused ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none',
                        borderRadius: '25px', padding: '8px 20px', transition: 'all 0.3s ease',
                        width: isFocused ? '340px' : '260px'
                    }}>
                        <Search size={16} color={isFocused ? 'var(--primary)' : 'var(--text-muted)'} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={handleSearch}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            style={{ background: 'transparent', border: 'none', color: 'white', padding: '4px 12px', outline: 'none', width: '100%', fontSize: '0.90rem' }}
                            placeholder="Power Search (e.g. tabs, tools)..." 
                        />
                    </div>
                    <AnimatePresence>
                        {searchResults.length > 0 && isFocused && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="glass-card" 
                                style={{ 
                                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '12px', 
                                    padding: '12px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                                    background: 'rgba(15, 15, 20, 0.85)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    backdropFilter: 'blur(20px)'
                                }}
                            >
                                <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', paddingLeft: '8px', marginBottom: '4px' }}>Quick Actions</span>
                                {searchResults.map((res, i) => (
                                    <div key={i} onClick={() => handleResultClick(res.url)} 
                                        style={{ padding: '12px 15px', cursor: 'pointer', borderRadius: '10px', transition: '0.2s', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '15px' }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                    >
                                        <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Navigation size={14} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '13px', color: 'white', fontWeight: 600 }}>{res.title}</h4>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{res.url}</span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                <motion.button whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }} className="btn btn-ghost" style={{ width: '45px', height: '45px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-bell"></i>
                </motion.button>
                <Link to="/profile">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', 
                        borderRadius: '50%', 
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
                    }}>
                        {user ? user.full_name[0].toUpperCase() : 'S'}
                    </motion.div>
                </Link>
            </div>
        </motion.div>
    );
};

export default TopBar;
