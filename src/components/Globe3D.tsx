import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// --- Error Boundary for Canvas ---
class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error('Canvas error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>Failed to render 3D Globe. Check console.</div>;
    }
    return this.props.children;
  }
}

// --- Earth Component ---
function Earth({ activityData = [] }: { activityData?: any[] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Earth texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture(); // fallback

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a4d6b');
    gradient.addColorStop(0.3, '#2563eb');
    gradient.addColorStop(0.6, '#16a34a');
    gradient.addColorStop(0.8, '#84cc16');
    gradient.addColorStop(1, '#eab308');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

  // Lights + activity texture
  const lightsTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffeb3b';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillRect(x, y, 2, 2);
    }

    ctx.shadowBlur = 10;
    activityData.forEach((activity) => {
      if (activity.latitude == null || activity.longitude == null) return;

      const x = ((activity.longitude + 180) / 360) * canvas.width;
      const y = ((90 - activity.latitude) / 180) * canvas.height;

      const severity = activity.severity || 'low';
      const color = severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f59e0b' : '#10b981';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    return new THREE.CanvasTexture(canvas);
  }, [activityData]);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.003;
    if (cloudsRef.current) cloudsRef.current.rotation.y += 0.002;
  });

  return (
    <group>
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

      <Sphere args={[2.1, 32, 32]}>
        <meshBasicMaterial color={0x4fc3f7} transparent opacity={0.1} side={THREE.BackSide} />
      </Sphere>

      {activityData.map((activity, index) => {
        if (index === 0) return null;
        const prev = activityData[index - 1];
        if (!prev || !prev.latitude || !prev.longitude || !activity.latitude || !activity.longitude)
          return null;
        return <ConnectionLine key={index} start={prev} end={activity} />;
      })}
    </group>
  );
}

// --- Connection Line Component ---
function ConnectionLine({ start, end }: { start: any; end: any }) {
  if (!start || !end) return null;

  const points = useMemo(() => {
    const radius = 2.1;

    const convert = (lat: number, lon: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    const startPoint = convert(start.latitude, start.longitude);
    const endPoint = convert(end.latitude, end.longitude);

    return [startPoint, endPoint];
  }, [start, end]);

  if (!points || points.length < 2) return null;

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#60a5fa" transparent opacity={0.6} />
    </line>
  );
}

// --- Star Field ---
function StarField() {
  const count = 1000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 100;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 100;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.5} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

// --- Globe3D Exported Component ---
export function Globe3D({ activityData = [] }: { activityData?: any[] }) {
  return (
    <div className="w-full h-full min-h-[400px] relative">
      <CanvasErrorBoundary>
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4fc3f7" />
          <Suspense fallback={null}>
            <StarField />
            <Earth activityData={activityData} />
          </Suspense>
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
      </CanvasErrorBoundary>

      <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 p-3">
        <div className="text-xs text-muted-foreground mb-1">Live Activity</div>
        <div className="text-sm font-medium">{activityData.length} Active Connections</div>
      </div>
    </div>
  );
}
