"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TorusKnot, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <TorusKnot ref={meshRef} args={[1.5, 0.4, 200, 32]} position={[2, 0, -2]}>
      <MeshDistortMaterial
        color="#a1a1aa" // zinc-400
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.4}
        metalness={0.6}
        wireframe={false}
      />
    </TorusKnot>
  );
}

function FloatingShape2() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * -0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * -0.1;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.6) * -0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[-2, 1, -5]}>
      <icosahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial color="#a1a1aa" wireframe /> {/* zinc-400 */}
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full opacity-40 pointer-events-none" style={{ left: "297px" }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#a1a1aa" />
        <pointLight position={[0, -5, 5]} intensity={1} color="#ffffff" />
        <FloatingShape />
        <FloatingShape2 />
      </Canvas>
    </div>
  );
}
