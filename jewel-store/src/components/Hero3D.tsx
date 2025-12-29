'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Diamond(props: any) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.2;
      ref.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={ref} {...props}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          roughness={0} 
          metalness={0.1}
          transmission={0.9} 
          thickness={2.5}
          ior={2.4}
          color="#fff1f2" /* rose-50 */
          attenuationColor="#ffe4e6"
          attenuationDistance={0.5}
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
}

function GemCluster() {
   return (
     <group position={[2, 0, 0]} rotation={[0, 0, 0.5]}>
        <Diamond position={[0, 0, 0]} scale={1.8} />
        <Diamond position={[-1.5, 1, -1]} scale={0.8} />
        <Diamond position={[-0.5, -1.5, 0.5]} scale={1} />
     </group>
   )
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#fb7185" /> {/* rose-400 */ }
        
        <GemCluster />
        
        <Environment preset="studio" />
        {/* <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} /> */}
      </Canvas>
    </div>
  );
}
