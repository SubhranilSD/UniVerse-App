import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   ProjexaAI Chat Assistant
   Props:
     context      – 'mental_health' | 'communication' | 'general'
     accentColor  – hex color for the theme
     title        – display title
     subtitle     – display subtitle
     welcomeMsg   – first message from the bot
   ───────────────────────────────────────────────────────────── */

const STORAGE_KEY_PREFIX = 'projexaai_chat_history_';

const TypingIndicator = ({ color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 18px', background: 'rgba(255,255,255,0.06)', borderRadius: '18px 18px 18px 4px', width: 'fit-content', maxWidth: 80 }}>
        {[0, 1, 2].map(i => (
            <motion.div key={i}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                style={{ width: 7, height: 7, borderRadius: '50%', background: color || '#6366f1' }}
            />
        ))}
    </div>
);

const MessageBubble = ({ msg, accentColor }) => {
    const isUser = msg.role === 'user';
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 10, marginBottom: 16 }}
        >
            {/* Avatar */}
            {!isUser && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`, border: `1px solid ${accentColor}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                    🤖
                </div>
            )}

            {/* Bubble */}
            <div style={{
                maxWidth: '75%',
                padding: '13px 18px',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isUser
                    ? `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`
                    : 'rgba(255,255,255,0.07)',
                border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: 14,
                lineHeight: 1.6,
                boxShadow: isUser ? `0 4px 20px ${accentColor}40` : '0 2px 10px rgba(0,0,0,0.2)',
                wordBreak: 'break-word',
            }}>
                {msg.content}
                <div style={{ fontSize: 10, marginTop: 6, opacity: 0.5, textAlign: isUser ? 'left' : 'right', fontFamily: 'monospace' }}>
                    {msg.time}
                </div>
            </div>

            {isUser && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                    👤
                </div>
            )}
        </motion.div>
    );
};

const AIChatBot = ({
    context = 'general',
    accentColor = '#6366f1',
    title = 'ProjexaAI Assistant',
    subtitle = 'Intelligent Campus Companion',
    welcomeMsg = "Hello! I'm ProjexaAI Assistant — here to help with academic guidance, mental health support, and campus information. What can I help you with today? 🎓",
}) => {
    const storageKey = STORAGE_KEY_PREFIX + context;
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) return JSON.parse(saved);
        } catch {}
        return [{ id: 1, role: 'assistant', content: welcomeMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
    });
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [orbPulse, setOrbPulse] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Persist messages to localStorage (simulating MongoDB memory)
    useEffect(() => {
        try { localStorage.setItem(storageKey, JSON.stringify(messages.slice(-50))); } catch {}
    }, [messages, storageKey]);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Pulse orb when closed and AI has activity
    useEffect(() => {
        if (!isOpen) {
            const interval = setInterval(() => setOrbPulse(p => !p), 3000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
    }, [isOpen]);

    const sendMessage = useCallback(async (text) => {
        if (!text.trim() || isTyping) return;
        const userMsg = {
            id: Date.now(), role: 'user', content: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, context, history })
            });
            const data = await res.json();
            setMessages(prev => [...prev, {
                id: Date.now() + 1, role: 'assistant', content: data.reply || "I'm here to help! Could you rephrase that?",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now() + 1, role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again in a moment.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    }, [messages, context, isTyping]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
    };

    const clearHistory = () => {
        const fresh = [{ id: 1, role: 'assistant', content: welcomeMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
        setMessages(fresh);
        localStorage.removeItem(storageKey);
    };

    const suggestedPrompts = {
        mental_health: ['I feel stressed about exams', "I can't sleep well", 'Help me with motivation', 'I feel overwhelmed'],
        communication: ['Class schedule?', 'Who is my advisor?', 'Upcoming events?', 'Campus announcements'],
        general: ['How is my GPA?', 'Check attendance', 'Exam tips', 'Transport routes'],
    };
    const prompts = suggestedPrompts[context] || suggestedPrompts.general;

    return (
        <>
            {/* ─── FLOATING ORB ─── */}
            <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(true)}
                            style={{
                                width: 62, height: 62, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                                boxShadow: `0 0 0 ${orbPulse ? '12px' : '6px'} ${accentColor}30, 0 8px 32px ${accentColor}50`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                                transition: 'box-shadow 1.5s ease',
                            }}
                        >
                            🤖
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* ─── CHAT PANEL ─── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 40 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
                        style={{
                            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
                            width: 400, height: 600,
                            background: 'rgba(10, 12, 22, 0.97)',
                            backdropFilter: 'blur(30px)',
                            border: `1px solid ${accentColor}30`,
                            borderRadius: 24,
                            boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px ${accentColor}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${accentColor}20`, background: `linear-gradient(135deg, ${accentColor}15, transparent)`, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                            <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`, border: `1px solid ${accentColor}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                                🤖
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, color: 'white', fontSize: 15 }}>{title}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 2s infinite' }} />
                                    <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Online · {subtitle}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={clearHistory} title="Clear history" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '5px 8px', fontSize: 12 }}>🗑</button>
                                <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '5px 8px', fontSize: 12 }}>✕</button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', scrollbarWidth: 'thin', scrollbarColor: `${accentColor}30 transparent` }}>
                            {messages.map(msg => (
                                <MessageBubble key={msg.id} msg={msg} accentColor={accentColor} />
                            ))}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 16 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${accentColor}20`, border: `1px solid ${accentColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
                                    <TypingIndicator color={accentColor} />
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Prompts (only on first load) */}
                        {messages.length <= 1 && (
                            <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {prompts.map((p, i) => (
                                    <motion.button key={i} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        onClick={() => sendMessage(p)}
                                        style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30`, borderRadius: 20, padding: '6px 13px', color: accentColor, cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                                        {p}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div style={{ padding: '12px 16px', borderTop: `1px solid ${accentColor}20`, flexShrink: 0, background: 'rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: `1px solid ${accentColor}30`, borderRadius: 16, padding: '4px 4px 4px 16px', transition: 'border-color 0.2s' }}>
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message..."
                                    disabled={isTyping}
                                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: 14, outline: 'none', padding: '8px 0' }}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                                    onClick={() => sendMessage(input)}
                                    disabled={!input.trim() || isTyping}
                                    style={{
                                        width: 40, height: 40, borderRadius: 12, border: 'none', cursor: !input.trim() || isTyping ? 'not-allowed' : 'pointer',
                                        background: input.trim() && !isTyping ? `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` : 'rgba(255,255,255,0.08)',
                                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                                        transition: 'background 0.3s', boxShadow: input.trim() && !isTyping ? `0 4px 15px ${accentColor}40` : 'none',
                                        flexShrink: 0,
                                    }}
                                >
                                    {isTyping ? '⏳' : '→'}
                                </motion.button>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
                                ProjexaAI · Memory-enabled · Context-aware
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatBot;
