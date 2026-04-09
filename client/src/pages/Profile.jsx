import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const Profile = () => {
    const location = useLocation();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');

    const [formData, setFormData] = useState({
        full_name: '', roll_no: '', email: '', phone: '', address: '', dob: '', blood_group: '', profile_image: ''
    });
    const [securityData, setSecurityData] = useState({ current_password: '', new_password: '', confirm_password: '' });
    const [prefData, setPrefData] = useState({ email_notify: 1, sms_notify: 1 });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profile_image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('projexam_user')) || {};
        const isStudent = storedUser?.role === 'student';
        const targetId = location.state?.impersonateId || storedUser?.id || 1;
        
        fetch(isStudent ? `/api/students/${targetId}` : `/api/students/${targetId}`)
            .then(res => res.json())
            .then(user => {
                setProfile(user);
                setFormData({
                    full_name: user?.full_name || '',
                    roll_no: user?.roll_no || user?.id || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    address: user?.address || '',
                    dob: user?.dob || '',
                    blood_group: user?.blood_group || '',
                    profile_image: user?.profile_image || ''
                });
                setPrefData({ 
                    email_notify: user?.email_notify ?? 1, 
                    sms_notify: user?.sms_notify ?? 1 
                });
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSecurityChange = (e) => setSecurityData({ ...securityData, [e.target.id]: e.target.value });
    const handlePrefChange = (e) => setPrefData({ ...prefData, [e.target.id]: e.target.checked ? 1 : 0 });

    const getStoredContext = () => {
        const storedUser = JSON.parse(localStorage.getItem('projexam_user')) || {};
        const isStudent = storedUser?.role === 'student';
        const targetId = location.state?.impersonateId || storedUser?.id || 1;
        return { isStudent, targetId, storedUser };
    };

    const handleSavePersonal = async () => {
        const { isStudent, targetId, storedUser } = getStoredContext();
        const endpoint = isStudent ? `/api/students/${targetId}` : `/api/profile/${targetId}`; 

        try {
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                alert("Success: Database Records Synchronized Natively!");
                if (!location.state?.impersonateId) {
                    localStorage.setItem('projexam_user', JSON.stringify({ ...storedUser, ...formData }));
                    window.dispatchEvent(new Event('profileUpdate'));
                }
            } else {
                const err = await res.json();
                alert("Transaction Exception: " + (err.error || "Unknown Error"));
            }
        } catch (err) { alert("Network routing error occurred during PUT transaction."); }
    };

    const handleSaveSecurity = async () => {
        if(securityData.new_password !== securityData.confirm_password) {
            return alert("New passwords do not match.");
        }
        const { isStudent, targetId } = getStoredContext();
        const endpoint = isStudent ? `/api/students/${targetId}/security` : `/api/profile/${targetId}/security`; 
        
        try {
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_password: securityData.current_password, new_password: securityData.new_password })
            });
            if(res.ok) {
                alert("Security Key Successfully Updated in Database!");
                setSecurityData({current_password: '', new_password: '', confirm_password: ''});
            } else {
                const err = await res.json();
                alert("Error: " + err.error);
            }
        } catch(e) { alert("Network routing error."); }
    };

    const handleSavePreferences = async () => {
        const { isStudent, targetId } = getStoredContext();
        const endpoint = isStudent ? `/api/students/${targetId}/preferences` : `/api/profile/${targetId}/preferences`; 
        
        try {
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prefData)
            });
            if(res.ok) alert("Global Application Preferences Saved to Database!");
            else {
                const err = await res.json();
                alert("Error: " + err.error);
            }
        } catch(e) { alert("Network routing error."); }
    };

    if (loading) return <p style={{padding:"40px", color:"var(--text-muted)"}}>Executing DB handshake...</p>;

    const renderPersonalTab = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="form-grid">
            <div className="form-group">
                <label className="form-label" style={{color:"var(--text-muted)"}}>Full Name</label>
                <input type="text" className="form-control" id="full_name" value={formData.full_name} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="form-label" style={{color:"var(--text-muted)"}}>Identity Key (Roll No)</label>
                <input type="text" className="form-control" id="roll_no" value={formData.roll_no} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="form-label" style={{color:"var(--text-muted)"}}>Email Address</label>
                <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="form-label" style={{color:"var(--text-muted)"}}>Phone Network</label>
                <input type="tel" className="form-control" id="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group" style={{"gridColumn": "span 2"}}>
                <label className="form-label" style={{color:"var(--text-muted)"}}>Physical Address</label>
                <input type="text" className="form-control" id="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="form-label" style={{color:"var(--text-muted)"}}>Date of Birth</label>
                <input type="date" className="form-control" id="dob" value={formData.dob} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="form-label" style={{color:"var(--text-muted)"}}>Blood Group</label>
                <input type="text" className="form-control" id="blood_group" value={formData.blood_group} onChange={handleChange} />
            </div>

            <div style={{"gridColumn": "span 2", "marginTop": "20px", "display": "flex", "justifyContent": "flex-end", "gap": "10px"}}>
                <Link to="/dashboard" className="btn btn-ghost">Cancel</Link>
                <button type="button" className="btn btn-primary" onClick={handleSavePersonal}>Execute DB Write</button>
            </div>
        </motion.div>
    );

    const renderSecurityTab = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="form-grid">
            <div className="form-group" style={{gridColumn: 'span 2'}}>
                <label className="form-label" style={{color:"var(--text-muted)"}}>Current Password</label>
                <input type="password" id="current_password" value={securityData.current_password} onChange={handleSecurityChange} className="form-control" placeholder="••••••••" />
            </div>
            <div className="form-group">
                <label className="form-label" style={{color:"var(--text-muted)"}}>New Password</label>
                <input type="password" id="new_password" value={securityData.new_password} onChange={handleSecurityChange} className="form-control" placeholder="New Password" />
            </div>
            <div className="form-group">
                <label className="form-label" style={{color:"var(--text-muted)"}}>Confirm Password</label>
                <input type="password" id="confirm_password" value={securityData.confirm_password} onChange={handleSecurityChange} className="form-control" placeholder="Confirm Password" />
            </div>
            <div style={{gridColumn: "span 2", marginTop: "20px", display: "flex", justifyContent: "flex-end"}}>
                <button type="button" className="btn btn-primary" onClick={handleSaveSecurity}>Update Security Key</button>
            </div>
        </motion.div>
    );

    const renderPreferencesTab = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <p style={{color: "var(--text-muted)", marginBottom: "20px"}}>Manage your global application settings here.</p>
             <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
                 <label style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px"}}>
                     <span style={{color: "white"}}>Email Notifications</span>
                     <input type="checkbox" id="email_notify" checked={prefData.email_notify === 1} onChange={handlePrefChange} />
                 </label>
                 <label style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px"}}>
                     <span style={{color: "white"}}>SMS Alerts</span>
                     <input type="checkbox" id="sms_notify" checked={prefData.sms_notify === 1} onChange={handlePrefChange} />
                 </label>
                 <label style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px"}}>
                     <span style={{color: "white"}}>Dark Mode Override</span>
                     <input type="checkbox" defaultChecked disabled title="System forces Dark Mode" />
                 </label>
             </div>
             <div style={{marginTop: "20px", display: "flex", justifyContent: "flex-end"}}>
                <button type="button" className="btn btn-primary" onClick={handleSavePreferences}>Save Preferences</button>
             </div>
        </motion.div>
    );

  return (
    <PageTransition>
      <div className="glass-card" style={{"padding": "0", "maxWidth": "800px", "margin": "0 auto"}}>
        <div className="profile-header" style={{padding: "40px", paddingBottom: "20px", display: "flex", alignItems: "center", gap: "20px", borderBottom: "1px solid var(--glass-border)"}}>
                <div style={{ position: "relative" }}>
                    <div className="profile-pic-large" style={{width: "80px", height: "80px", borderRadius: "50%", background: formData.profile_image ? `url(${formData.profile_image}) center/cover` : "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: "white", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)"}}>
                        {!formData.profile_image && <i className="fa-solid fa-user"></i>}
                    </div>
                    <label style={{ position: "absolute", bottom: "-5px", right: "-5px", background: "rgba(0,0,0,0.8)", padding: "6px", borderRadius: "50%", cursor: "pointer", border: "1px solid rgba(255,255,255,0.3)", display: "flex" }}>
                        <i className="fa-solid fa-camera" style={{ color: "white", fontSize: "12px" }}></i>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                    </label>
                </div>
                <div>
                    <h2 style={{"margin": "0", color:"white", fontSize: "1.8rem"}}>{formData.full_name || "Authorized Profile"}</h2>
                    <p style={{"margin": "0", color:"rgba(255,255,255,0.7)", marginTop: "5px"}}>{profile?.stream || profile?.role || "Root Administrator"} • Secured Access</p>
                </div>
            </div>

            {/* TAB SYSTEM */}
            <div style={{display: "flex", gap: "20px", padding: "0 40px", borderBottom: "1px solid var(--glass-border)"}}>
                <button 
                    onClick={() => setActiveTab('personal')}
                    style={{padding: "15px 0", background: "none", border: "none", borderBottom: activeTab === 'personal' ? "2px solid var(--primary)" : "2px solid transparent", color: activeTab === 'personal' ? "white" : "var(--text-muted)", cursor: "pointer", fontWeight: "600"}}
                >
                    Personal Information
                </button>
                <button 
                    onClick={() => setActiveTab('security')}
                    style={{padding: "15px 0", background: "none", border: "none", borderBottom: activeTab === 'security' ? "2px solid var(--primary)" : "2px solid transparent", color: activeTab === 'security' ? "white" : "var(--text-muted)", cursor: "pointer", fontWeight: "600"}}
                >
                    Security
                </button>
                <button 
                    onClick={() => setActiveTab('preferences')}
                    style={{padding: "15px 0", background: "none", border: "none", borderBottom: activeTab === 'preferences' ? "2px solid var(--primary)" : "2px solid transparent", color: activeTab === 'preferences' ? "white" : "var(--text-muted)", cursor: "pointer", fontWeight: "600"}}
                >
                    Preferences
                </button>
            </div>

            <div style={{padding: "40px"}}>
                <AnimatePresence mode="wait">
                    {activeTab === 'personal' && <motion.div key="personal">{renderPersonalTab()}</motion.div>}
                    {activeTab === 'security' && <motion.div key="security">{renderSecurityTab()}</motion.div>}
                    {activeTab === 'preferences' && <motion.div key="preferences">{renderPreferencesTab()}</motion.div>}
                </AnimatePresence>
            </div>
        </div>
    </PageTransition>
  );
};

export default Profile;