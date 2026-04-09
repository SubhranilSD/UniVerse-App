import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY_PREFIX = 'projexaai_inline_chat_';

const TypingIndicator = ({ color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 18px', background: 'rgba(255,255,255,0.06)', borderRadius: '18px 18px 18px 4px', width: 'fit-content', maxWidth: 80 }}>
        {[0, 1, 2].map(i => (
            <motion.div key={i}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                style={{ width: 7, height: 7, borderRadius: '50%', background: color || '#06b6d4' }}
            />
        ))}
    </div>
);

const MessageBubble = ({ msg, accentColor }) => {
    const isUser = msg.role === 'user';
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28 }}
            style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 10, marginBottom: 14 }}
        >
            {!isUser && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${accentColor}20`, border: `1px solid ${accentColor}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                    🤖
                </div>
            )}
            <div style={{
                maxWidth: '70%', padding: '13px 18px',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isUser ? `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` : 'rgba(255,255,255,0.07)',
                border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: 'white', fontSize: 14, lineHeight: 1.6,
                boxShadow: isUser ? `0 4px 20px ${accentColor}35` : '0 2px 10px rgba(0,0,0,0.15)',
                wordBreak: 'break-word',
            }}>
                {msg.content}
                <div style={{ fontSize: 10, marginTop: 5, opacity: 0.45, textAlign: isUser ? 'left' : 'right', fontFamily: 'monospace' }}>
                    {msg.time}
                </div>
            </div>
            {isUser && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                    👤
                </div>
            )}
        </motion.div>
    );
};

const AIChatInline = ({ context = 'general', accentColor = '#06b6d4', title, subtitle, welcomeMsg }) => {
    const storageKey = STORAGE_KEY_PREFIX + context;
    const [messages, setMessages] = useState(() => {
        try {
            const s = localStorage.getItem(storageKey);
            if (s) return JSON.parse(s);
        } catch {}
        return [{ id: 1, role: 'assistant', content: welcomeMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
    });
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(messages.slice(-50))); } catch {} }, [messages, storageKey]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

    const sendMessage = useCallback(async (text) => {
        if (!text.trim() || isTyping) return;
        const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text, time: t }]);
        setInput('');
        setIsTyping(true);
        try {
            const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
            const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, context, history }) });
            const data = await res.json();
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.reply || "I'm here to help!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } catch {
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "Connection error. Please try again.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally { setIsTyping(false); }
    }, [messages, context, isTyping]);

    const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } };

    const suggestedPrompts = {
        communication: ['Class schedule?', 'Fee deadline?', 'Upcoming events?', 'Transport routes'],
        mental_health: ['I feel stressed', "Can't focus", 'Help me sleep better', 'Exam anxiety'],
        general: ['My GPA?', 'Attendance check', 'Study tips', 'Campus resources'],
    };
    const prompts = suggestedPrompts[context] || suggestedPrompts.general;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 520 }}>
            {/* Header */}
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${accentColor}25`, background: `linear-gradient(135deg, ${accentColor}12, transparent)`, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${accentColor}20`, border: `1px solid ${accentColor}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    🤖
                </div>
                <div>
                    <div style={{ fontWeight: 800, color: 'white', fontSize: 16 }}>{title || 'ProjexaAI Assistant'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                        <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Online · {subtitle || 'AI Powered'}</span>
                    </div>
                </div>
                <button onClick={() => { const f = [{ id: 1, role: 'assistant', content: welcomeMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]; setMessages(f); localStorage.removeItem(storageKey); }}
                    style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '5px 10px', fontSize: 12 }}>
                    🗑 Clear
                </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px', scrollbarWidth: 'thin', scrollbarColor: `${accentColor}30 transparent` }}>
                {messages.map(msg => <MessageBubble key={msg.id} msg={msg} accentColor={accentColor} />)}
                {isTyping && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 14 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${accentColor}20`, border: `1px solid ${accentColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
                        <TypingIndicator color={accentColor} />
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Prompts */}
            {messages.length <= 1 && (
                <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {prompts.map((p, i) => (
                        <motion.button key={i} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={() => sendMessage(p)}
                            style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}35`, borderRadius: 20, padding: '6px 14px', color: accentColor, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                            {p}
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div style={{ padding: '12px 20px', borderTop: `1px solid ${accentColor}20`, flexShrink: 0, background: 'rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: `1px solid ${accentColor}30`, borderRadius: 16, padding: '4px 4px 4px 16px' }}>
                    <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                        placeholder="Type your message..." disabled={isTyping} autoFocus
                        style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: 14, outline: 'none', padding: '8px 0' }}
                    />
                    <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
                        style={{ width: 40, height: 40, borderRadius: 12, border: 'none', cursor: !input.trim() || isTyping ? 'not-allowed' : 'pointer', background: input.trim() && !isTyping ? `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` : 'rgba(255,255,255,0.08)', color: 'white', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }}>
                        {isTyping ? '⏳' : '→'}
                    </motion.button>
                </div>
                <div style={{ textAlign: 'center', marginTop: 7, fontSize: 10, color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace' }}>
                    ProjexaAI · Memory-enabled · Context-aware
                </div>
            </div>
        </div>
    );
};

export default AIChatInline;
