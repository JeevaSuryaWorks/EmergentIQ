import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const DataNodes = () => {
    const points = useMemo(() => {
        const p = new Float32Array(500 * 3);
        for (let i = 0; i < 500; i++) {
            p[i * 3] = (Math.random() - 0.5) * 10;
            p[i * 3 + 1] = (Math.random() - 0.5) * 10;
            p[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return p;
    }, []);

    return (
        <Points positions={points} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#888"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

const Globe = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.5}>
                <MeshDistortMaterial
                    color="#1a1a1a"
                    roughness={0.4}
                    metalness={0.8}
                    distort={0.3}
                    speed={2}
                    wireframe
                />
            </Sphere>
            {/* Inner solid sphere for depth */}
            <Sphere args={[0.98, 64, 64]} scale={2.5}>
                <meshStandardMaterial color="#050505" roughness={0.1} metalness={1} />
            </Sphere>
        </Float>
    );
};

export const Hero3D = () => {
    return (
        <div className="absolute inset-0 w-full h-full -z-10 bg-black">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{
                    antialias: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: false,
                    alpha: false
                }}
                dpr={[1, 2]} // Performance optimization for high-DPI screens
                performance={{ min: 0.5 }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
                <Globe />
                <DataNodes />
                <fog attach="fog" args={['#000', 5, 15]} />
            </Canvas>
            {/* Overlay gradient for smooth blending */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />
        </div>
    );
};
