import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [activePortal, setActivePortal] = useState('student'); // 'student' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleAdminOverride = (e) => {
      e.preventDefault();
      // Instantly inject an absolute root bypass session into local memory
      localStorage.setItem('projexam_user', JSON.stringify({ 
          id: 1, 
          full_name: "Super Administrator", 
          role: "admin",
          email: "root@university.edu"
      }));
      navigate('/admin');
  };

  const handleAuth = async (e) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      if (isRegister) {
          // Process Registration
          try {
              const res = await fetch('/api/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password, full_name: fullName })
              });
              const data = await res.json();
              
              if (data.success) {
                  setSuccess("Account created! An administrator must verify your account before you can log in.");
                  setIsRegister(false);
                  setPassword(''); 
              } else {
                  setError(data.error || 'Failed to create account.');
              }
          } catch (err) {
              setError('Failed to connect to backend server.');
          }
      } else {
          // Process Login
          try {
              const res = await fetch('/api/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password })
              });
              const data = await res.json();
              if (data.success) {
                  localStorage.setItem('projexam_user', JSON.stringify(data.user));
                  navigate('/dashboard'); 
              } else {
                  setError(data.error || 'Invalid credentials');
              }
          } catch (err) {
              setError('Failed to connect to backend server.');
          }
      }
  };

  return (
    <PageTransition>
      <div className="login-container">
        
        <div className="liquid-shape"></div>
        <div className="liquid-shape"></div>

        <div className="login-box glass-card" style={{ padding: "0" }}>
            
            {/* PORTAL SELECTOR */}
            <div style={{ display: "flex", width: "100%", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <button 
                    onClick={() => setActivePortal('student')}
                    style={{ flex: 1, background: activePortal === 'student' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', padding: '15px', color: activePortal === 'student' ? 'white' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                    <i className="fa-solid fa-graduation-cap"></i> Student Gateway
                </button>
                <button 
                    onClick={() => setActivePortal('admin')}
                    style={{ flex: 1, background: activePortal === 'admin' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', padding: '15px', color: activePortal === 'admin' ? '#f59e0b' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                    <i className="fa-solid fa-user-shield"></i> Teacher Override
                </button>
            </div>

            <div style={{ padding: "40px 30px" }}>
                <div style={{"marginBottom": "20px"}}>
                    <i className={`fa-solid ${activePortal === 'admin' ? 'fa-fingerprint' : isRegister ? 'fa-id-card' : 'fa-brain'} fa-3x text-gradient`}></i>
                </div>
                
                <h2 style={{"marginBottom": "5px"}}>
                    {activePortal === 'admin' ? 'System Administrator' : isRegister ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p style={{"marginBottom": "30px", color: "var(--text-muted)"}}>
                    {activePortal === 'admin' ? 'Root access node initialized.' : isRegister ? 'Register below. An admin will verify your account.' : 'Access your ProjexaAI Dashboard'}
                </p>
                
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} style={{"padding": "10px", "background": "rgba(239, 68, 68, 0.2)", "border": "1px solid var(--error)", "color": "white", "borderRadius": "8px", "marginBottom": "20px", overflow: "hidden"}}>
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} style={{"padding": "10px", "background": "rgba(16, 185, 129, 0.2)", "border": "1px solid #10b981", "color": "white", "borderRadius": "8px", "marginBottom": "20px", overflow: "hidden"}}>
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                {activePortal === 'student' ? (
                    <form onSubmit={handleAuth}>
                        <AnimatePresence mode="wait">
                            {isRegister && (
                                <motion.div key="name-field" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{"position": "relative", marginBottom: "15px"}}>
                                    <i className="fa-solid fa-user" style={{"position": "absolute", "left": "15px", "top": "25px", "color": "var(--text-muted)"}}></i>
                                    <input 
                                        type="text" 
                                        placeholder="Full Name" 
                                        className="login-input" 
                                        style={{"paddingLeft": "45px"}} 
                                        required={isRegister}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div style={{"position": "relative", marginBottom: "15px"}}>
                            <i className="fa-solid fa-envelope" style={{"position": "absolute", "left": "15px", "top": "25px", "color": "var(--text-muted)"}}></i>
                            <input 
                                type="text" 
                                placeholder={isRegister ? "Educational Email" : "Student Email / Roll No"} 
                                className="login-input" 
                                style={{"paddingLeft": "45px"}} 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div style={{"position": "relative", marginBottom: "15px"}}>
                            <i className="fa-solid fa-lock" style={{"position": "absolute", "left": "15px", "top": "25px", "color": "var(--text-muted)"}}></i>
                            <input 
                                type="password" 
                                placeholder={isRegister ? "Create secure password" : "Password"}
                                className="login-input" 
                                style={{"paddingLeft": "45px"}} 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {!isRegister && (
                            <div style={{"textAlign": "right", "marginBottom": "15px"}}>
                                <Link to="#" style={{"fontSize": "14px"}}>Forgot Password?</Link>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{"width": "100%", "padding": "14px", "fontSize": "16px", marginTop: isRegister ? "15px" : "0"}}>
                            {isRegister ? 'Create Account' : 'Secure Login'} <i className="fa-solid fa-arrow-right" style={{"marginLeft": "8px"}}></i>
                        </button>

                        <div style={{marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <p style={{"fontSize": "14px", marginLeft: "auto", color: "var(--text-muted)"}}>
                                {isRegister ? 'Already have an account? ' : 'New here? '} 
                                <button type="button" onClick={() => setIsRegister(!isRegister)} style={{background: "none", border: "none", color: "var(--primary)", cursor: "pointer", textDecoration: "underline", padding: 0, fontWeight: "bold"}}>
                                    {isRegister ? 'Login securely' : 'Create account'}
                                </button>
                            </p>
                        </div>
                    </form>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                        <div style={{ padding: "15px", background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.5)", borderRadius: "8px", color: "#f59e0b", textAlign: "center", fontSize: "0.9rem" }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{marginRight: "8px"}}></i>
                            Security protocols suspended per user override.
                        </div>
                        <button 
                            type="button" 
                            onClick={handleAdminOverride} 
                            style={{ width: "100%", padding: "15px", background: "#f59e0b", color: "black", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer", boxShadow: "0 0 20px rgba(245,158,11,0.4)" }}
                        >
                            Initialize Teacher Bypass <i className="fa-solid fa-bolt" style={{ marginLeft: "8px" }}></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
    </PageTransition>
  );
};

export default Login;