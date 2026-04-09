import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const fetchUser = () => {
            const stored = localStorage.getItem('projexam_user');
            if (stored) setUser(JSON.parse(stored));
        };
        fetchUser();
        
        // Listen for profile updates from other components
        window.addEventListener('storage', fetchUser);
        window.addEventListener('profileUpdate', fetchUser);
        return () => {
            window.removeEventListener('storage', fetchUser);
            window.removeEventListener('profileUpdate', fetchUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('projexam_user');
        navigate('/login');
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <aside className="sidebar" onMouseMove={handleMouseMove}>
            <div className="sidebar-header" style={{ paddingBottom: '10px', marginBottom: '25px' }}>
                <Logo />
            </div>

            <nav style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>
                <div className="nav-group">
                    <div className="nav-label">Main</div>
                    <NavLink to="/dashboard" state={location.state} className="nav-link">
                        <i className="fa-solid fa-house"></i> Dashboard
                    </NavLink>
                    <NavLink to="/smart-campus" state={location.state} className="nav-link">
                        <i className="fa-solid fa-map-location-dot"></i> Smart Campus
                    </NavLink>
                    <NavLink to="/academics" state={location.state} className="nav-link">
                        <i className="fa-solid fa-calendar-days"></i> Academics
                    </NavLink>
                    <NavLink to="/people" state={location.state} className="nav-link">
                        <i className="fa-solid fa-users"></i> People
                    </NavLink>
                    <NavLink to="/learning-lms" state={location.state} className="nav-link">
                        <i className="fa-solid fa-book-open"></i> Learning (LMS)
                    </NavLink>
                </div>

                <div className="nav-group">
                    <div className="nav-label">Core Integrations</div>
                    <NavLink to="/mental-health" state={location.state} className="nav-link">
                        <i className="fa-solid fa-brain"></i> Mental Health <span style={{fontSize: "10px", marginLeft: "auto"}}>⭐</span>
                    </NavLink>
                    <NavLink to="/predictive-learning" state={location.state} className="nav-link">
                        <i className="fa-solid fa-bolt"></i> Predictive Learning <span style={{fontSize: "10px", marginLeft: "auto"}}>⭐</span>
                    </NavLink>
                    <NavLink to="/attendance" state={location.state} className="nav-link">
                        <i className="fa-solid fa-school"></i> Attendance
                    </NavLink>
                    <NavLink to="/transportation-intelligence" state={location.state} className="nav-link">
                        <i className="fa-solid fa-bus"></i> Transportation Map <span style={{fontSize: "9px", background: "var(--warning)", color: "black", padding: "2px 4px", borderRadius: "4px", marginLeft: "auto", fontWeight: "bold"}}>NEW</span>
                    </NavLink>
                    <NavLink to="/online-tests" state={location.state} className="nav-link">
                        <i className="fa-solid fa-vial"></i> Online MCQ Tests
                    </NavLink>
                </div>

                <div className="nav-group">
                    <div className="nav-label">Administration</div>
                    <NavLink to="/exams-results" state={location.state} className="nav-link">
                        <i className="fa-solid fa-file-invoice"></i> Exams & Results
                    </NavLink>
                    <NavLink to="/fees-finance" state={location.state} className="nav-link">
                        <i className="fa-solid fa-wallet"></i> Fees & Finance
                    </NavLink>
                    <NavLink to="/communication" state={location.state} className="nav-link">
                        <i className="fa-solid fa-comments"></i> Communication
                    </NavLink>
                    <NavLink to="/admin" state={location.state} className="nav-link">
                        <i className="fa-solid fa-shield-halved"></i> Admin Panel
                    </NavLink>
                </div>

                <div className="nav-group">
                    <div className="nav-label">System</div>
                    <NavLink to="/profile" state={location.state} className="nav-link">
                        <i className="fa-solid fa-user"></i> Profile
                    </NavLink>
                    <NavLink to="/reports" className="nav-link">
                        <i className="fa-solid fa-file-contract"></i> Reports
                    </NavLink>
                    <NavLink to="/settings" className="nav-link">
                        <i className="fa-solid fa-gear"></i> Settings
                    </NavLink>
                </div>
            </nav>

            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                {user && (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px", padding: "0 10px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: user.profile_image ? `url(${user.profile_image}) center/cover` : "var(--primary)", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {!user.profile_image && <i className="fa-solid fa-user" style={{ fontSize: "14px", color: "white" }}></i>}
                        </div>
                        <div style={{ overflow: "hidden" }}>
                            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.full_name}</div>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{user.role === 'admin' ? 'Root Admin' : 'Student'}</div>
                        </div>
                    </div>
                )}
                <button onClick={handleLogout} className="nav-link" style={{ border: "none", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", cursor: "pointer", width: "100%", justifyContent: "flex-start" }}>
                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
