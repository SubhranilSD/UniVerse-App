import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
            <div style={{ position: 'relative', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Background Shadow Square (Solid) */}
                <div style={{ 
                    position: 'absolute', 
                    top: '4px', 
                    left: '4px', 
                    width: '34px', 
                    height: '34px', 
                    background: 'var(--primary)', 
                    opacity: 0.3,
                    borderRadius: '8px',
                    zIndex: 0
                }} />

                {/* Main Core (Solid) */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    style={{
                        position: 'relative',
                        width: '34px',
                        height: '34px',
                        background: 'var(--primary)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        zIndex: 2,
                        overflow: 'hidden'
                    }}
                >
                    {/* Scanning Beam */}
                    <motion.div
                        animate={{ 
                            top: ['-100%', '200%'],
                            opacity: [0, 1, 0]
                        }}
                        transition={{ 
                            duration: 2.5, 
                            repeat: Infinity, 
                            ease: "linear",
                            repeatDelay: 1
                        }}
                        style={{
                            position: 'absolute',
                            left: 0,
                            width: '100%',
                            height: '2px',
                            background: 'white',
                            boxShadow: '0 0 10px white',
                            zIndex: 3
                        }}
                    />

                    <i className="fa-solid fa-atom" style={{ color: 'white', fontSize: '18px', zIndex: 4 }}></i>
                </motion.div>

                {/* Orbit Rings (Solid Lines) */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 1
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h1 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '900', 
                    letterSpacing: '1px',
                    margin: 0,
                    lineHeight: 1,
                    color: 'white'
                }}>
                    Uni<span style={{ color: 'var(--primary)' }}>Verse</span>
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ 
                        fontSize: '0.6rem', 
                        color: 'var(--text-muted)', 
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        fontWeight: '800'
                    }}>
                        NEURAL NINJAS
                    </span>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 5px var(--primary)' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Logo;
