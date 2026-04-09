import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const PredictiveLearning = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState({
        full_name: "Loading AI Map...",
        gpa: 0,
        marks_maths: 0,
        marks_ds: 0,
        marks_os: 0,
        marks_english: 0
    });

    const targetId = location.state?.impersonateId || JSON.parse(localStorage.getItem('projexam_user'))?.id || 1;

    useEffect(() => {
        fetch(`/api/students/${targetId}`)
            .then(res => res.json())
            .then(data => {
                if(data.full_name) {
                     setAnalytics({
                         full_name: data.full_name,
                         gpa: data.gpa,
                         marks_maths: data.marks_maths || 75,
                         marks_ds: data.marks_ds || 75,
                         marks_os: data.marks_os || 75,
                         marks_english: data.marks_english || 75
                     });
                }
            }).catch(console.error);
    }, [targetId]);

    // AI Classification Core
    const subjects = [
        { name: 'Mathematics II', mark: analytics.marks_maths },
        { name: 'Data Structures', mark: analytics.marks_ds },
        { name: 'Operating Systems', mark: analytics.marks_os },
        { name: 'English', mark: analytics.marks_english }
    ];

    // Sort by performance ascending
    const sortedSubjects = [...subjects].sort((a, b) => a.mark - b.mark);
    
    // Dynamically fetch highest recommended plans matching lowest marks
    const weak1 = sortedSubjects[0];
    const weak2 = sortedSubjects[1];

  return (
    <PageTransition>
      <div style={{ marginBottom: "25px" }}>
          <h2 style={{ fontSize: "2.2rem", marginBottom: "5px", textShadow: "0 0 15px rgba(255,255,255,0.2)" }}>
              Neural Assessment: <span style={{ color: "var(--primary)" }}>{analytics.full_name}</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
              AI-Augmented target analysis mapped to current operating metric: <strong style={{ color: "var(--success)" }}>{(parseFloat(analytics.gpa) + 0.5).toFixed(1)} CGPA</strong>
          </p>
      </div>

      <div className="grid-3" style={{ gap: "25px" }}>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card" style={{"gridColumn": "span 2", padding: "30px", background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)", border: "1px solid rgba(255,255,255,0.08)"}}
                >
                    <h3 style={{ marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        Performance Breakdown
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "normal" }}><i className="fa-solid fa-chart-line text-gradient"></i> Live Sync</span>
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "25px" }}>
                        {subjects.map((sub, i) => {
                            const isWeak = sub.mark < 60;
                            const isWarning = sub.mark >= 60 && sub.mark < 75;
                            const color = isWeak ? "var(--error)" : isWarning ? "var(--warning)" : "var(--success)";
                            
                            return (
                                <div key={i} style={{ width: "100%" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                                        <span>{sub.name}</span>
                                        <span style={{ color, textShadow: `0 0 10px ${color}` }}>{sub.mark}%</span>
                                    </div>
                                    <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", overflow: "hidden" }}>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${sub.mark}%` }}
                                            transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                                            style={{ height: "100%", background: color, boxShadow: `0 0 15px ${color}`, borderRadius: "10px" }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div style={{"marginTop": "35px", "background": "rgba(0,0,0,0.3)", "padding": "20px", "borderRadius": "12px", border: "1px solid rgba(255,255,255,0.05)"}}>
                        <div style={{"display": "flex", "justifyContent": "space-between", "marginBottom": "15px"}}>
                            <span style={{ fontWeight: "600", color: "#f59e0b" }}><i className="fa-solid fa-microchip"></i> Neural Impact Simulator</span>
                            <span style={{"fontSize": "12px", "color": "var(--text-muted)"}}>Drag slider to calculate projection</span>
                        </div>
                        <input type="range" style={{"width": "100%", "accentColor": "var(--secondary)"}} />
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{"fontSize": "14px", "marginTop": "15px", color: "var(--text-main)"}}>
                            AI Projection: A structural +10% improvement in <strong style={{color:"var(--secondary)"}}>{weak1.name}</strong> will elevate aggregate base GPA to <strong style={{color:"var(--success)"}}>{(parseFloat(analytics.gpa) + 0.2).toFixed(1)}</strong>.
                        </motion.p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-card" style={{ padding: "30px", display: "flex", flexDirection: "column" }}
                >
                    <h3 style={{ marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>Priority Matrix</h3>
                    <p style={{"fontSize": "13px", "marginBottom": "20px", color: "var(--text-muted)"}}>Algorithms scanning lowest baseline performance nodes.</p>

                    <div style={{"display": "flex", "flexDirection": "column", "gap": "10px"}}>
                        {sortedSubjects.map((sub, idx) => {
                             let tagColor = "var(--success)";
                             let status = "Stabilized";
                             let icon = "fa-check";
                             if(sub.mark < 60) {
                                 tagColor = "var(--error)";
                                 status = "Critical Risk";
                                 icon = "fa-triangle-exclamation";
                             } else if(sub.mark < 75) {
                                 tagColor = "var(--warning)";
                                 status = "Warning Signal";
                                 icon = "fa-circle-exclamation";
                             }

                             return (
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    key={idx} 
                                    className="priority-list-item" 
                                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderLeft: `4px solid ${tagColor}`, borderRadius: "8px", padding: "12px 15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                >
                                    <div>
                                        <div style={{fontWeight: "600", fontSize: "14px"}}>{sub.name} <span style={{ color: "var(--text-muted)", fontSize: "12px", marginLeft: "5px" }}>({sub.mark}%)</span></div>
                                        <div style={{fontSize: "12px", color: tagColor, marginTop: "2px"}}>{status}</div>
                                    </div>
                                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: `rgba(${tagColor === 'var(--error)' ? '2ef,68,68' : tagColor === 'var(--warning)' ? '245,158,11' : '16,185,129'}, 0.1)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <i className={`fa-solid ${icon}`} style={{fontSize: "12px", color: tagColor}}></i>
                                    </div>
                                </motion.div>
                             )
                        })}
                    </div>
                </motion.div>
            </div>

                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "40px", marginBottom: "25px" }}>
                    <i className="fa-solid fa-bolt text-gradient fa-2x"></i>
                    <div>
                        <h3 style={{ margin: 0 }}>Actionable Study Blueprint</h3>
                        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>Computed remedies specifically crafted for {analytics.full_name.split(' ')[0]}</p>
                    </div>
                </div>

                <motion.div 
                    initial="hidden" animate="visible"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
                    className="grid-4" style={{ gap: "20px" }}
                >
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-card zoom-hover" style={{ borderTop: "3px solid var(--secondary)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                            <i className={`fa-solid ${weak1.name.includes("M") ? "fa-calculator" : "fa-code"} fa-2x`} style={{"marginBottom": "15px", color: "var(--secondary)"}}></i>
                            <h4 style={{ fontSize: "16px", marginBottom: "8px" }}>Address {weak1.name} Deficit</h4>
                            <p style={{"fontSize": "13px", color:"var(--text-muted)", lineHeight: "1.5"}}>Identified major discrepancy at {weak1.mark}%. Read associated course material Chapter 4.</p>
                        </div>
                        <div style={{"fontSize": "12px", "color": "var(--success)", "marginTop": "15px", padding: "10px", background: "rgba(16,185,129,0.1)", borderRadius: "6px", fontWeight: "500"}}><i className="fa-solid fa-arrow-trend-up"></i> +2% Overall GPA Impact Projected</div>
                    </motion.div>

                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-card zoom-hover" style={{ borderTop: "3px solid #f59e0b", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                            <i className={`fa-solid ${weak2.name.includes("E") ? "fa-book" : "fa-laptop"} fa-2x`} style={{"marginBottom": "15px", color: "#f59e0b"}}></i>
                            <h4 style={{ fontSize: "16px", marginBottom: "8px" }}>Revise {weak2.name} Theory</h4>
                            <p style={{"fontSize": "13px", color: "var(--text-muted)", lineHeight: "1.5"}}>Underperforming at {weak2.mark}%. Requesting targeted revision session on the digital LMS.</p>
                        </div>
                        <div style={{"fontSize": "12px", "color": "var(--success)", "marginTop": "15px", padding: "10px", background: "rgba(16,185,129,0.1)", borderRadius: "6px", fontWeight: "500"}}><i className="fa-solid fa-arrow-trend-up"></i> +1.2% Overall GPA Impact Projected</div>
                    </motion.div>

                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-card zoom-hover" style={{ borderTop: "3px solid var(--primary)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                            <i className="fa-solid fa-vial fa-2x" style={{"marginBottom": "15px", color: "var(--primary)"}}></i>
                            <h4 style={{ fontSize: "16px", marginBottom: "8px" }}>Attempt Diagnostic Quiz</h4>
                            <p style={{"fontSize": "13px", color: "var(--text-muted)", lineHeight: "1.5"}}>Begin a 15-minute diagnostic simulation parsing current error vectors across both weaknesses.</p>
                        </div>
                        <button 
                            className="btn btn-primary" 
                            style={{"padding": "8px 15px", "fontSize": "13px", "width": "100%", "marginTop": "15px", fontWeight: "bold"}}
                            onClick={() => navigate('/online-tests', { state: { impersonateId: targetId, subject: weak1.mark < weak2.mark ? weak1.name.toLowerCase().includes('math') ? 'marks_maths' : weak1.name.toLowerCase().includes('struct') ? 'marks_ds' : weak1.name.toLowerCase().includes('system') ? 'marks_os' : 'marks_english' : weak2.name.toLowerCase().includes('math') ? 'marks_maths' : weak2.name.toLowerCase().includes('struct') ? 'marks_ds' : weak2.name.toLowerCase().includes('system') ? 'marks_os' : 'marks_english' } })}
                        >
                            Commence Engine
                        </button>
                    </motion.div>

                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-card zoom-hover" style={{ borderTop: "3px solid #ec4899", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                            <i className="fa-solid fa-robot fa-2x" style={{"marginBottom": "15px", color: "#ec4899"}}></i>
                            <h4 style={{ fontSize: "16px", marginBottom: "8px" }}>Neural Material Generation</h4>
                            <p style={{"fontSize": "13px", color: "var(--text-muted)", lineHeight: "1.5"}}>Invoke the Large Language model to construct a bespoke study guide focusing entirely on {weak1.name}.</p>
                        </div>
                        <button className="btn" style={{"padding": "8px 15px", "fontSize": "13px", "width": "100%", "marginTop": "15px", background: "rgba(236, 72, 153, 0.2)", color: "#ec4899", border: "1px solid rgba(236,72,153,0.5)", fontWeight: "bold"}}>Initialize AI Agent</button>
                    </motion.div>
                </motion.div>
        
    </PageTransition>
  );
};

export default PredictiveLearning;