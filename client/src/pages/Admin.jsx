import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('students');
    const [showStudentForm, setShowStudentForm] = useState(false);

    const [stats, setStats] = useState({ total_students: 0, total_faculty: 0, pending_fees: 0, library_books: 0 });
    const [students, setStudents] = useState([]);
    const [fees, setFees] = useState([]);
    const [pendingAccounts, setPendingAccounts] = useState([]);

    // Sort / Filter state
    const [sortField, setSortField] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [filterStream, setFilterStream] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        full_name: '', roll_no: '', email: '', phone: '', stream: 'CSE', address: '', profile_image: ''
    });
    const [circularForm, setCircularForm] = useState({ title: '', content: '', audience: 'All' });

    const fetchBackendData = () => {
        fetch('/api/stats').then(r => r.json()).then(setStats).catch(console.error);
        fetch('/api/students').then(r => r.json()).then(setStudents).catch(console.error);
        fetch('/api/fees').then(r => r.json()).then(setFees).catch(console.error);
        fetch('/api/students/pending').then(r => r.json()).then(setPendingAccounts).catch(console.error);
    };

    useEffect(() => { fetchBackendData(); }, []);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
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

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowStudentForm(false);
                setFormData({ full_name: '', roll_no: '', email: '', phone: '', stream: 'CSE', address: '' });
                fetchBackendData();
            } else {
                const err = await res.json();
                alert("Database Error: " + err.error);
            }
        } catch (err) { console.error("Submission failed:", err); }
    };

    const handleValidateAccount = async (id) => {
        try {
            const res = await fetch(`/api/students/${id}/validate`, { method: 'PUT' });
            if (res.ok) fetchBackendData();
            else { const err = await res.json(); alert("Error: " + err.error); }
        } catch(e) { console.error(e); }
    };

    const handleDenyAccount = async (id) => {
        try {
            const res = await fetch(`/api/students/${id}/deny`, { method: 'PUT' });
            if (res.ok) fetchBackendData();
            else { const err = await res.json(); alert("Error: " + err.error); }
        } catch(e) { console.error(e); }
    };

    const handleRemindFee = async (id) => {
        try {
            await fetch('/api/fees/remind', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ student_id: id }) });
            alert('Reminder sent!');
        } catch(e) {}
    };

    const handleCircularBroadcast = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/circulars', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(circularForm) });
            if (res.ok) {
                alert("Success: Circular broadcasted!");
                setCircularForm({ title: '', content: '', audience: 'All' });
            } else { const err = await res.json(); alert("Error: " + err.error); }
        } catch (err) { alert("Network error."); }
    };

    // Sorting + Filtering logic
    const displayedStudents = useMemo(() => {
        let list = [...students];

        // Pending always on top
        list.sort((a, b) => {
            const aPending = a.account_status === 'Pending' ? -1 : 1;
            const bPending = b.account_status === 'Pending' ? -1 : 1;
            return aPending - bPending;
        });

        // Filter by stream
        if (filterStream !== 'All') {
            list = list.filter(s => (s.stream || '') === filterStream);
        }

        // Filter by search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(s =>
                s.full_name?.toLowerCase().includes(q) ||
                s.roll_no?.toLowerCase().includes(q) ||
                s.email?.toLowerCase().includes(q)
            );
        }

        // Sort (but keep pending at top)
        const pending = list.filter(s => s.account_status === 'Pending');
        const rest = list.filter(s => s.account_status !== 'Pending');

        const sorted = rest.sort((a, b) => {
            let valA, valB;
            switch (sortField) {
                case 'name': valA = a.full_name || ''; valB = b.full_name || ''; break;
                case 'stream': valA = a.stream || ''; valB = b.stream || ''; break;
                case 'gpa': valA = parseFloat(a.gpa) || 0; valB = parseFloat(b.gpa) || 0; break;
                case 'attendance': valA = parseFloat(a.attendance_pct) || 0; valB = parseFloat(b.attendance_pct) || 0; break;
                case 'status': valA = a.account_status || ''; valB = b.account_status || ''; break;
                default: valA = a.full_name || ''; valB = b.full_name || '';
            }
            if (typeof valA === 'string') return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            return sortDir === 'asc' ? valA - valB : valB - valA;
        });

        return [...pending, ...sorted];
    }, [students, sortField, sortDir, filterStream, searchQuery]);

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
        return <span style={{ color: 'var(--primary)', marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
    };

    const tabVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <PageTransition>
            <style>{`
                .admin-tabs { display:flex; gap:10px; margin-bottom:20px; border-bottom:2px solid var(--glass-border); padding-bottom:12px; overflow-x:auto; flex-wrap:wrap; }
                .tab-btn { background:none; border:1px solid transparent; color:var(--text-muted); padding:9px 18px; cursor:pointer; font-weight:600; transition:all 0.25s; border-radius:10px; font-size:0.88rem; white-space:nowrap; }
                .tab-btn:hover { background:var(--bg-glass); color:var(--text-main); border-color:var(--glass-border); }
                .tab-btn.active { background:var(--primary); color:white; box-shadow:0 4px 15px rgba(99,102,241,0.35); border-color:transparent; }
                .action-table { width:100%; border-collapse:collapse; font-size:13.5px; }
                .action-table th { text-align:left; padding:13px 14px; color:var(--text-muted); border-bottom:2px solid var(--glass-border); font-size:11px; text-transform:uppercase; letter-spacing:0.08em; cursor:pointer; user-select:none; white-space:nowrap; }
                .action-table th:hover { color:var(--text-main); }
                .action-table td { padding:13px 14px; border-bottom:1px solid var(--glass-border); vertical-align:middle; }
                .action-table tr:hover td { background:rgba(255,255,255,0.03); }
                .sort-controls { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
                .sort-pill { background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); border-radius:8px; padding:5px 14px; color:var(--text-muted); font-size:12px; cursor:pointer; font-weight:600; transition:all 0.2s; }
                .sort-pill.active, .sort-pill:hover { background:rgba(99,102,241,0.15); border-color:var(--primary); color:var(--primary); }
                .pending-row td { background: rgba(245,158,11,0.04); }
                @keyframes pulse-amber { 0%,100%{box-shadow:0 0 6px #f59e0b;} 50%{box-shadow:0 0 18px #f59e0b;} }
            `}</style>

            {/* ─── PENDING ACCOUNTS BANNER ─── */}
            <AnimatePresence>
                {pendingAccounts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16 }}
                        style={{
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.08) 100%)',
                            border: '1px solid rgba(245,158,11,0.45)',
                            borderRadius: '16px',
                            padding: '20px 24px',
                            marginBottom: '28px',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
                            <div style={{ width:10, height:10, borderRadius:'50%', background:'#f59e0b', animation:'pulse-amber 2s infinite' }} />
                            <h3 style={{ color:'#f59e0b', margin:0, fontSize:'0.95rem', fontWeight:700 }}>
                                <i className="fa-solid fa-triangle-exclamation" style={{ marginRight:8 }} />
                                {pendingAccounts.length} Unverified Account{pendingAccounts.length > 1 ? 's' : ''} Awaiting Admin Approval
                            </h3>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                            {pendingAccounts.map(acc => (
                                <div key={acc.id} style={{
                                    display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px',
                                    background:'rgba(0,0,0,0.2)', borderRadius:'10px', padding:'12px 16px',
                                    border:'1px solid rgba(255,255,255,0.06)'
                                }}>
                                    <div>
                                        <div style={{ fontWeight:700, color:'white', fontSize:'0.95rem' }}>{acc.full_name}</div>
                                        <div style={{ color:'var(--text-muted)', fontSize:'0.78rem', marginTop:2 }}>
                                            <i className="fa-solid fa-envelope" style={{ marginRight:5, opacity:0.6 }} />{acc.email}
                                            &nbsp;·&nbsp;
                                            <i className="fa-solid fa-calendar" style={{ marginRight:5, opacity:0.6 }} />Registered {acc.admission_date}
                                        </div>
                                    </div>
                                    <div style={{ display:'flex', gap:'8px' }}>
                                        <button onClick={() => handleValidateAccount(acc.id)} style={{ background:'rgba(16,185,129,0.18)', border:'1px solid #10b981', color:'#10b981', borderRadius:'9px', padding:'7px 18px', cursor:'pointer', fontWeight:700, fontSize:'0.82rem', transition:'all 0.2s', letterSpacing:'0.04em' }}>
                                            <i className="fa-solid fa-check" style={{ marginRight:6 }} />Verify
                                        </button>
                                        <button onClick={() => handleDenyAccount(acc.id)} style={{ background:'rgba(239,68,68,0.18)', border:'1px solid #ef4444', color:'#ef4444', borderRadius:'9px', padding:'7px 18px', cursor:'pointer', fontWeight:700, fontSize:'0.82rem', transition:'all 0.2s', letterSpacing:'0.04em' }}>
                                            <i className="fa-solid fa-xmark" style={{ marginRight:6 }} />Deny
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── STATS GRID ─── */}
            <div className="grid-4" style={{ marginBottom:'28px' }}>
                {[
                    { label:'Total Students', value: stats.total_students, icon:'fa-users', color:'#6366f1' },
                    { label:'Pending Approvals', value: pendingAccounts.length, icon:'fa-user-clock', color:'#f59e0b' },
                    { label:'Pending Fees', value: `$${stats.pending_fees}`, icon:'fa-wallet', color:'#ef4444' },
                    { label:'Library Books', value: stats.library_books, icon:'fa-book', color:'#10b981' },
                ].map((s, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.04 }} className="glass-card" style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                        <div style={{ width:46, height:46, borderRadius:12, background:`${s.color}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <i className={`fa-solid ${s.icon}`} style={{ color:s.color, fontSize:'1.1rem' }} />
                        </div>
                        <div>
                            <div style={{ color:'var(--text-muted)', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:2 }}>{s.label}</div>
                            <div style={{ fontSize:'1.6rem', fontWeight:800 }}>{s.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ─── TABS ─── */}
            <div className="admin-tabs">
                {[
                    { key:'students', icon:'fa-users', label:'Students' },
                    { key:'faculty', icon:'fa-chalkboard-user', label:'Faculty' },
                    { key:'fees', icon:'fa-money-bill', label:'Fees' },
                    { key:'circulars', icon:'fa-bullhorn', label:'Circulars' },
                ].map(t => (
                    <button key={t.key} className={`tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
                        <i className={`fa-solid ${t.icon}`} style={{ marginRight:7 }} />{t.label}
                        {t.key === 'students' && pendingAccounts.length > 0 && (
                            <span style={{ background:'#ef4444', color:'white', borderRadius:'50%', width:18, height:18, fontSize:'10px', fontWeight:800, display:'inline-flex', alignItems:'center', justifyContent:'center', marginLeft:8 }}>
                                {pendingAccounts.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* ─── STUDENTS TAB ─── */}
                {activeTab === 'students' && (
                    <motion.div key="students" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="glass-card">
                        {/* Header */}
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
                            <div>
                                <h3 style={{ marginBottom:4 }}>Student Records</h3>
                                <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', margin:0 }}>{displayedStudents.length} total · {pendingAccounts.length} pending verification</p>
                            </div>
                            <motion.button whileTap={{ scale:0.95 }} className="btn btn-primary" onClick={() => setShowStudentForm(!showStudentForm)}>
                                {showStudentForm ? '× Cancel' : '+ Add Student'}
                            </motion.button>
                        </div>

                        {/* Search + Sort + Filter Controls */}
                        <div style={{ display:'flex', gap:'10px', marginBottom:'18px', flexWrap:'wrap', alignItems:'center' }}>
                            {/* Search */}
                            <div style={{ position:'relative', flex: 1, minWidth:180 }}>
                                <i className="fa-solid fa-magnifying-glass" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:13 }} />
                                <input type="text" placeholder="Search name, roll no, email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    style={{ width:'100%', paddingLeft:36, padding:'9px 12px 9px 36px', background:'rgba(255,255,255,0.05)', border:'1px solid var(--glass-border)', borderRadius:10, color:'white', fontSize:13, boxSizing:'border-box' }} />
                            </div>

                            {/* Stream filter */}
                            <select value={filterStream} onChange={e => setFilterStream(e.target.value)}
                                style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--glass-border)', borderRadius:10, color:'var(--text-main)', padding:'9px 14px', fontSize:13, cursor:'pointer' }}>
                                <option value="All">All Streams</option>
                                <option value="CSE">CSE</option>
                                <option value="ME">Mechanical</option>
                                <option value="CE">Civil</option>
                            </select>

                            {/* Sort pills */}
                            <div className="sort-controls">
                                <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, whiteSpace:'nowrap' }}>SORT BY:</span>
                                {[
                                    { field:'name', label:'Name' },
                                    { field:'stream', label:'Stream' },
                                    { field:'gpa', label:'GPA/Marks' },
                                    { field:'attendance', label:'Attendance' },
                                    { field:'status', label:'Status' },
                                ].map(s => (
                                    <button key={s.field} className={`sort-pill ${sortField === s.field ? 'active' : ''}`} onClick={() => toggleSort(s.field)}>
                                        {s.label} <SortIcon field={s.field} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Add Student Form */}
                        <AnimatePresence>
                            {showStudentForm && (
                                <motion.form onSubmit={handleAddStudent}
                                    initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                                    style={{ overflow:'hidden', marginBottom:20, padding:'20px', background:'rgba(99,102,241,0.06)', borderRadius:12, border:'1px solid rgba(99,102,241,0.2)' }}
                                >
                                    <h4 style={{ marginBottom:16, color:'var(--primary)' }}>Insert New Student Record</h4>
                                    <div className="form-grid">
                                        <div className="form-group"><label>Full Name</label><input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} className="form-control" required /></div>
                                        <div className="form-group"><label>Roll Number</label><input type="text" name="roll_no" value={formData.roll_no} onChange={handleInputChange} className="form-control" required /></div>
                                        <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" /></div>
                                        <div className="form-group"><label>Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="form-control" /></div>
                                        <div className="form-group"><label>Stream</label>
                                            <select name="stream" value={formData.stream} onChange={handleInputChange} className="form-control">
                                                <option value="CSE">CSE</option><option value="ME">Mechanical</option><option value="CE">Civil</option>
                                            </select>
                                        </div>
                                        <div className="form-group"><label>Address</label><input type="text" name="address" value={formData.address} onChange={handleInputChange} className="form-control" /></div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                            <label>Profile Picture</label>
                                            <div style={{ display:'flex', alignItems:'center', gap:15, marginTop:5 }}>
                                                <div style={{ width:50, height:50, borderRadius:'50%', background: formData.profile_image ? `url(${formData.profile_image}) center/cover` : 'rgba(255,255,255,0.1)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                                                    {!formData.profile_image && <i className="fa-solid fa-user" style={{ opacity:0.3 }}></i>}
                                                </div>
                                                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize:12, color:'var(--text-muted)' }} />
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-success" style={{ marginTop:8 }}>Save to Database</button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {/* Table */}
                        <div style={{ overflowX:'auto' }}>
                            {displayedStudents.length === 0
                                ? <p style={{ opacity:0.5, padding:'20px 0', textAlign:'center' }}>No records found.</p>
                                : (
                                <table className="action-table">
                                    <thead>
                                        <tr>
                                            <th onClick={() => toggleSort('name')}>Name <SortIcon field="name" /></th>
                                            <th>Roll No</th>
                                            <th>Email</th>
                                            <th onClick={() => toggleSort('stream')}>Stream <SortIcon field="stream" /></th>
                                            <th onClick={() => toggleSort('gpa')}>GPA <SortIcon field="gpa" /></th>
                                            <th onClick={() => toggleSort('attendance')}>Attendance <SortIcon field="attendance" /></th>
                                            <th onClick={() => toggleSort('status')}>Status <SortIcon field="status" /></th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedStudents.map((student) => (
                                            <tr key={student.id}
                                                className={student.account_status === 'Pending' ? 'pending-row' : ''}
                                                onClick={() => navigate('/dashboard', { state: { impersonateId: student.id } })}
                                                style={{ cursor:'pointer' }}
                                            >
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                                                        <div style={{ width:32, height:32, borderRadius:'50%', background: student.profile_image ? `url(${student.profile_image}) center/cover` : 'var(--primary)', flexShrink:0, border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                                                            {!student.profile_image && <i className="fa-solid fa-user" style={{ fontSize:14, color:'white' }}></i>}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight:600 }}>{student.full_name}</div>
                                                            {student.account_status === 'Pending' && <div style={{ fontSize:10, color:'#f59e0b', fontWeight:700, marginTop:2 }}>⏳ NEEDS APPROVAL</div>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ fontFamily:'monospace', color:'var(--primary)', fontSize:12 }}>{student.roll_no}</td>
                                                <td style={{ color:'var(--text-muted)', fontSize:12 }}>{student.email || '—'}</td>
                                                <td><span className="badge badge-stable">{student.stream || 'N/A'}</span></td>
                                                <td style={{ fontWeight:700, color: parseFloat(student.gpa) >= 8 ? '#10b981' : parseFloat(student.gpa) >= 6 ? '#f59e0b' : '#ef4444' }}>
                                                    {student.gpa ? `${student.gpa}` : '—'}
                                                </td>
                                                <td style={{ color: parseFloat(student.attendance_pct) >= 75 ? '#10b981' : '#ef4444', fontWeight:700 }}>
                                                    {student.attendance_pct ? `${student.attendance_pct}%` : '—'}
                                                </td>
                                                <td>
                                                    <span className={`badge ${student.account_status === 'Pending' ? 'badge-warning' : student.account_status === 'Denied' ? 'badge-error' : 'badge-success'}`}>
                                                        {student.account_status || 'Active'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {student.account_status === 'Pending' ? (
                                                        <div style={{ display:'flex', gap:6 }}>
                                                            <button onClick={(e) => { e.stopPropagation(); handleValidateAccount(student.id); }}
                                                                style={{ background:'rgba(16,185,129,0.15)', border:'1px solid #10b981', color:'#10b981', padding:'5px 12px', borderRadius:7, cursor:'pointer', fontSize:12, fontWeight:700 }}>
                                                                ✓ Verify
                                                            </button>
                                                            <button onClick={(e) => { e.stopPropagation(); handleDenyAccount(student.id); }}
                                                                style={{ background:'rgba(239,68,68,0.15)', border:'1px solid #ef4444', color:'#ef4444', padding:'5px 12px', borderRadius:7, cursor:'pointer', fontSize:12, fontWeight:700 }}>
                                                                ✗ Deny
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span style={{ color:'var(--text-muted)', fontSize:12 }}>
                                                            <i className="fa-solid fa-circle-check" style={{ color:'#10b981', marginRight:4 }} />Synced
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ─── FEES TAB ─── */}
                {activeTab === 'fees' && (
                    <motion.div key="fees" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="glass-card">
                        <h3 style={{ marginBottom:20 }}>Fee Records</h3>
                        <table className="action-table">
                            <thead><tr><th>Student</th><th>Fee Type</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {fees.map(fee => (
                                    <tr key={fee.id}>
                                        <td>{fee.full_name}</td>
                                        <td>{fee.type}</td>
                                        <td style={{ fontFamily:'monospace' }}>${fee.amount}</td>
                                        <td>{fee.due_date}</td>
                                        <td><span className={`badge ${fee.status === 'Paid' ? 'badge-stable' : 'badge-warning'}`}>{fee.status}</span></td>
                                        <td>{fee.status === 'Pending' && <button onClick={() => handleRemindFee(fee.student_id)} className="btn btn-ghost" style={{ padding:'4px 8px', fontSize:12 }}>Send Alert</button>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}

                {/* ─── FACULTY TAB ─── */}
                {activeTab === 'faculty' && (
                    <motion.div key="faculty" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="glass-card">
                        <h3>Faculty Management</h3>
                        <p style={{ color:'var(--text-muted)' }}>Manage professor records and subject assignments in the database.</p>
                    </motion.div>
                )}

                {/* ─── CIRCULARS TAB ─── */}
                {activeTab === 'circulars' && (
                    <motion.div key="circulars" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="glass-card">
                        <h3 style={{ marginBottom:20 }}>Publish Global Circulars</h3>
                        <form onSubmit={handleCircularBroadcast}>
                            <div className="form-group"><label>Title</label><input type="text" className="form-control" required value={circularForm.title} onChange={e => setCircularForm({ ...circularForm, title: e.target.value })} /></div>
                            <div className="form-group"><label>Content</label><textarea className="form-control" rows="4" required value={circularForm.content} onChange={e => setCircularForm({ ...circularForm, content: e.target.value })} /></div>
                            <div className="form-group"><label>Target Audience</label>
                                <select className="form-control" value={circularForm.audience} onChange={e => setCircularForm({ ...circularForm, audience: e.target.value })}>
                                    <option value="All">Global Broadcast (All)</option>
                                    <option value="Students">Students Only</option>
                                    <option value="Faculty">Faculty Only</option>
                                </select>
                            </div>
                            <br />
                            <motion.button whileTap={{ scale: 0.95 }} type="submit" className="btn btn-primary">Broadcast Circular</motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default Admin;
