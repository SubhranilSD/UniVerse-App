import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Box, MeshWobbleMaterial, Float } from '@react-three/drei';

const FloatingIcon = ({ color = "#4F46E5" }) => (
    <Canvas camera={{ position: [0, 0, 3] }} style={{ height: '40px', width: '40px' }} alpha>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Float speed={5} rotationIntensity={2} floatIntensity={2}>
            <Box args={[1, 1, 1]}>
                <MeshWobbleMaterial color={color} speed={4} factor={0.6} metalness={1} roughness={0} />
            </Box>
        </Float>
    </Canvas>
);

const ThreeDCard = ({ children, className = "", color = "#4F46E5" }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`relative glass-card group transition-all duration-300 ${className}`}
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <FloatingIcon color={color} />
            </div>
            <div style={{ transform: "translateZ(20px)" }}>
                {children}
            </div>
        </motion.div>
    );
};

export default ThreeDCard;
