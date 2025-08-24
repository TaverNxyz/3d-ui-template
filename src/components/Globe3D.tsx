import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Create Earth with city lights and realistic appearance
function Earth({ activityData = [] }: { activityData?: any[] }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // Create earth texture programmatically for a realistic look
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient for earth-like appearance
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a4d6b');
    gradient.addColorStop(0.3, '#2563eb');
    gradient.addColorStop(0.6, '#16a34a');
    gradient.addColorStop(0.8, '#84cc16');
    gradient.addColorStop(1, '#eab308');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some continent-like shapes
    ctx.fillStyle = '#065f46';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 100 + 50;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Create city lights texture
  const lightsTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add random city lights
    ctx.fillStyle = '#ffeb3b';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillRect(x, y, 2, 2);
    }
    
    // Add activity points from real data
    ctx.fillStyle = '#f59e0b';
    activityData.forEach((activity, index) => {
      if (activity.latitude != null && activity.longitude != null) {
        // Convert lat/lng to texture coordinates
        const x = ((activity.longitude + 180) / 360) * canvas.width;
        const y = ((90 - activity.latitude) / 180) * canvas.height;
        
        // Different colors for different severity
        const severity = activity.severity || 'low';
        const color = severity === 'high' ? '#ef4444' : 
                     severity === 'medium' ? '#f59e0b' : '#10b981';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });
    
    return new THREE.CanvasTexture(canvas);
  }, [activityData]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Main Earth */}
      <Sphere 
        ref={meshRef}
        args={[2, 64, 64]} 
        scale={hovered ? 1.05 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhongMaterial
          map={earthTexture}
          emissiveMap={lightsTexture}
          emissive={new THREE.Color(0x112244)}
          emissiveIntensity={0.3}
          shininess={100}
          transparent
        />
      </Sphere>

      {/* Atmospheric glow */}
      <Sphere args={[2.1, 32, 32]}>
        <meshBasicMaterial
          color={0x4fc3f7}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Connection lines between activity points */}
      {activityData.map((activity, index) => {
        if (index === 0 || activity.latitude == null || activity.longitude == null) return null;
        
        return (
          <ConnectionLine
            key={index}
            start={activityData[index - 1]}
            end={activity}
          />
        );
      })}
    </group>
  );
}

// Component for drawing connection lines between global activities
function ConnectionLine({ start, end }: { start: any, end: any }) {
  if (start.latitude == null || start.longitude == null || end.latitude == null || end.longitude == null) return null;

  const points = useMemo(() => {
    // Convert lat/lng to 3D coordinates on sphere
    const radius = 2.1;
    
    const startPhi = (90 - start.latitude) * (Math.PI / 180);
    const startTheta = (start.longitude + 180) * (Math.PI / 180);
    const startX = radius * Math.sin(startPhi) * Math.cos(startTheta);
    const startY = radius * Math.cos(startPhi);
    const startZ = radius * Math.sin(startPhi) * Math.sin(startTheta);

    const endPhi = (90 - end.latitude) * (Math.PI / 180);
    const endTheta = (end.longitude + 180) * (Math.PI / 180);
    const endX = radius * Math.sin(endPhi) * Math.cos(endTheta);
    const endY = radius * Math.cos(endPhi);
    const endZ = radius * Math.sin(endPhi) * Math.sin(endTheta);

    return [
      new THREE.Vector3(startX, startY, startZ),
      new THREE.Vector3(endX, endY, endZ)
    ];
  }, [start, end]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#60a5fa" transparent opacity={0.6} />
    </line>
  );
}

// Enhanced star field
function StarField() {
  const count = 1000;
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#ffffff" 
        size={0.5} 
        sizeAttenuation 
        transparent
        opacity={0.8}
      />
    </points>
  );
}

export function Globe3D({ activityData = [] }: { activityData?: any[] }) {
  return (
    <div className="w-full h-full min-h-[400px] relative">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={1.2} 
          color="#ffffff"
        />
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={0.5} 
          color="#4fc3f7" 
        />
        
        <StarField />
        <Earth activityData={activityData} />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minDistance={4}
          maxDistance={15}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>
      
      {/* Data overlay */}
      <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 p-3">
        <div className="text-xs text-muted-foreground mb-1">Live Activity</div>
        <div className="text-sm font-medium">{activityData.length} Active Connections</div>
      </div>
    </div>
  );
}