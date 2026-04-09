import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { Map, Wind, Users, Zap, Coffee, Building, Navigation, WifiHigh, ShieldCheck } from 'lucide-react';
import campus1 from '../assets/campus1.jpg';
import campus2 from '../assets/campus2.jpg';
import campus3 from '../assets/campus3.jpg';
import campus4 from '../assets/campus4.jpg';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const SmartCampus = () => {
  return (
    <PageTransition>
        <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2.4rem', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Map size={36} color="var(--primary)" /> Smart Campus <span className="text-gradient">Hub</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '800px' }}>
                Access real-time geospatial tracking, environmental metrics, and infrastructure telemetry across the university campus.
            </p>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
            
            {/* HERO WIDGET: TRANSPORTATION */}
            <motion.div variants={cardVariants} className="glass-card" style={{ gridColumn: 'span 8', padding: '0', overflow: 'hidden', position: 'relative', minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `url(${campus1}) center/cover`, opacity: 0.4, zIndex: 0 }}></div>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)', zIndex: 1 }}></div>
                
                <div style={{ position: 'relative', zIndex: 2, padding: '30px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Navigation size={14} /> LIVE ROUTING
                            </span>
                            <h3 style={{ fontSize: '2rem', marginTop: '15px', marginBottom: '5px' }}>Campus Transit Network</h3>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.6 }}>Track university shuttles in real-time, view dynamic ETA overlays, and calculate shortest paths between academic blocks.</p>
                        </div>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <WifiHigh color="var(--primary)" />
                        </div>
                    </div>
                    <div>
                        <Link to="/transportation-intelligence" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                            <Map size={18} /> Initialize Neural Map
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* METRICS WIDGETS */}
            <motion.div variants={cardVariants} className="glass-card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-layer-2)' }}>
                <h4 style={{ margin: 0, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Zap size={18} color="#f59e0b" /> Campus Telemetry
                </h4>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: 45, height: 45, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                        <Wind size={20} />
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Air Quality Index</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>42 (Excellent)</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: 45, height: 45, borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                        <Users size={20} />
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Library Occupancy</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>84% Capacity</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: 45, height: 45, borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                        <Coffee size={20} />
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cafeteria Crowd</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>High Traffic</div>
                    </div>
                </div>
            </motion.div>

            {/* FACILITIES OVERVIEW */}
            <motion.div variants={cardVariants} style={{ gridColumn: 'span 12', marginTop: '10px' }}>
                <h3 style={{ marginBottom: '20px' }}>Facility Status</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    
                    <motion.div whileHover={{ y: -5, background: 'rgba(255,255,255,0.05)' }} className="glass-card" style={{ padding: '20px', borderTop: '3px solid #8b5cf6' }}>
                        <Building size={24} color="#8b5cf6" style={{ marginBottom: '15px' }} />
                        <h4 style={{ margin: '0 0 5px 0' }}>Block A (Engineering)</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 15px 0' }}>All labs operational. Maintenance cleared.</p>
                        <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                            <ShieldCheck size={14} /> SECURITY CLEARED
                        </span>
                    </motion.div>

                    <motion.div whileHover={{ y: -5, background: 'rgba(255,255,255,0.05)' }} className="glass-card" style={{ padding: '20px', borderTop: '3px solid #ec4899' }}>
                        <Building size={24} color="#ec4899" style={{ marginBottom: '15px' }} />
                        <h4 style={{ margin: '0 0 5px 0' }}>Block B (Management)</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 15px 0' }}>Auditorium booked 12PM-2PM.</p>
                        <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                            <ShieldCheck size={14} /> SECURITY CLEARED
                        </span>
                    </motion.div>

                    <motion.div whileHover={{ y: -5, background: 'rgba(255,255,255,0.05)' }} className="glass-card" style={{ padding: '20px', borderTop: '3px solid #14b8a6' }}>
                        <Building size={24} color="#14b8a6" style={{ marginBottom: '15px' }} />
                        <h4 style={{ margin: '0 0 5px 0' }}>Sports Complex</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 15px 0' }}>Indoor courts active. Pool closed for cleaning.</p>
                        <span style={{ fontSize: '0.8rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                            <ShieldCheck size={14} /> PARTIAL ACCESS
                        </span>
                    </motion.div>

                </div>
            </motion.div>

            {/* CAMPUS VISUALS GALLERY */}
            <motion.div variants={cardVariants} style={{ gridColumn: 'span 12', marginTop: '40px' }}>
                <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.8rem' }}>
                    <Users size={28} color="var(--primary)" /> Campus Environment
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0 }}
                        whileHover={{ scale: 1.03, rotate: -1, zIndex: 10 }} 
                        style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                        <img src={campus1} alt="KRMU Campus View 1" style={{ width: '100%', height: '350px', objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '20px' }}><h4 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Academic Block A</h4></div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ scale: 1.03, rotate: 1, zIndex: 10 }} 
                        style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                        <img src={campus2} alt="KRMU Campus View 2" style={{ width: '100%', height: '350px', objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '20px' }}><h4 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Central Library</h4></div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.03, rotate: -1, zIndex: 10 }} 
                        style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                        <img src={campus3} alt="KRMU Campus View 3" style={{ width: '100%', height: '350px', objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '20px' }}><h4 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Engineering Labs</h4></div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }}
                        whileHover={{ scale: 1.03, rotate: 1, zIndex: 10 }} 
                        style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                        <img src={campus4} alt="KRMU Campus View 4" style={{ width: '100%', height: '350px', objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '20px' }}><h4 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Recreation Center</h4></div>
                    </motion.div>
                </div>
            </motion.div>

        </motion.div>
    </PageTransition>
  );
};

export default SmartCampus;