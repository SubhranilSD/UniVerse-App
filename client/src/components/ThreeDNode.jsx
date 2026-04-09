import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

const NeuralSphere = ({ color = "#4F46E5" }) => {
    const mesh = useRef();
    
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.x = Math.cos(t / 4) / 2;
        mesh.current.rotation.y = Math.sin(t / 4) / 2;
        mesh.current.rotation.z = Math.sin(t / 1.5) / 10;
        mesh.current.position.y = Math.sin(t / 1.5) / 10;
    });

    return (
        <Sphere ref={mesh} args={[1, 32, 32]}>
            <MeshDistortMaterial
                color={color}
                speed={2}
                distort={0.4}
                radius={1}
                emissive={color}
                emissiveIntensity={0.5}
                roughness={0}
                metalness={1}
            />
        </Sphere>
    );
};

const ThreeDNode = ({ color, size = "40px" }) => {
    return (
        <div style={{ width: size, height: size }}>
            <Canvas camera={{ position: [0, 0, 3], fov: 45 }} alpha>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Float speed={4} rotationIntensity={1} floatIntensity={2}>
                    <NeuralSphere color={color} />
                </Float>
            </Canvas>
        </div>
    );
};

export default ThreeDNode;
