import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Compass, Eye, Zap } from 'lucide-react';

interface HeroForge3DProps {
  className?: string;
}

export const HeroForge3D: React.FC<HeroForge3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverdrive, setIsOverdrive] = useState<boolean>(false);
  const [coreColor, setCoreColor] = useState<'cyan' | 'violet' | 'amber'>('cyan');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // References for animation state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const pulseRef = useRef(0);
  const overdriveRef = useRef(false);
  overdriveRef.current = isOverdrive;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Groups
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Central glowing forge core (dodecahedron / icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4, // Cyan default
      emissive: 0x0891b2,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // 2. Wireframe exoskeleton cage
    const wireGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    masterGroup.add(wireMesh);

    // 3. Concentric Orbital Gimbal Rings (The "Forge Accelerator")
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.03, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x0e7490,
      emissiveIntensity: 0.4,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    masterGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.5, 0.025, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x4338ca,
      emissiveIntensity: 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    masterGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(2.9, 0.02, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.3,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.z = Math.PI / 6;
    masterGroup.add(ring3);

    // 4. Orbiting Floating Project Nodes (Representing launches circulating the forge)
    const nodeGroup = new THREE.Group();
    masterGroup.add(nodeGroup);

    const nodeCount = 5;
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeRadius = 3.3;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const nodeGeo = new THREE.BoxGeometry(0.35, 0.22, 0.05);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: i % 2 === 0 ? 0x06b6d4 : 0x8b5cf6,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.8,
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(
        Math.cos(angle) * nodeRadius,
        Math.sin(angle * 1.5) * 0.8,
        Math.sin(angle) * nodeRadius
      );
      nodeGroup.add(node);
      nodeMeshes.push(node);
    }

    // 5. Forge Sparks / Upward Thermal Draft Particle System
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Sphere distribution around core
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.3 + Math.random() * 2.8;

      posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i * 3 + 2] = r * Math.cos(phi);

      velocities[i * 3] = (Math.random() - 0.5) * 0.006;
      velocities[i * 3 + 1] = 0.004 + Math.random() * 0.008; // upward thermal draft
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.006;

      scaleArray[i] = 0.02 + Math.random() * 0.04;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Particle Material
    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particleSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0a101d, 2.5);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x06b6d4, 3.5, 12);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const topLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    topLight.position.set(5, 8, 6);
    scene.add(topLight);

    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 2.2);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = x * 2;
      mouseRef.current.targetY = -y * 2;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Visibility Observer to pause when offscreen
    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    intersectionObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();
      const speedMultiplier = overdriveRef.current ? 2.5 : 1.0;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Parallax rotation
      masterGroup.rotation.y = elapsedTime * 0.25 * speedMultiplier + mouseRef.current.x * 0.6;
      masterGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.15 + mouseRef.current.y * 0.4;

      // Core rotation & pulse
      coreMesh.rotation.y -= 0.008 * speedMultiplier;
      coreMesh.rotation.x += 0.005 * speedMultiplier;
      wireMesh.rotation.y += 0.004 * speedMultiplier;
      wireMesh.rotation.z += 0.003 * speedMultiplier;

      // Pulsating breath scale
      const breath = 1 + Math.sin(elapsedTime * 2.5) * 0.04 + pulseRef.current * 0.15;
      coreMesh.scale.set(breath, breath, breath);
      wireMesh.scale.set(breath * 1.05, breath * 1.05, breath * 1.05);

      // Gimbal Rings Counter-Rotation
      ring1.rotation.z += 0.012 * speedMultiplier;
      ring1.rotation.x += 0.006 * speedMultiplier;
      ring2.rotation.z -= 0.01 * speedMultiplier;
      ring2.rotation.y += 0.008 * speedMultiplier;
      ring3.rotation.y += 0.007 * speedMultiplier;
      ring3.rotation.x -= 0.009 * speedMultiplier;

      // Orbiting project nodes
      nodeGroup.rotation.y += 0.015 * speedMultiplier;
      nodeMeshes.forEach((node, idx) => {
        node.rotation.x += 0.02;
        node.rotation.y += 0.03;
        node.position.y += Math.sin(elapsedTime * 2 + idx) * 0.003;
      });

      // Particles upward drift and wrap
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3] * speedMultiplier;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * speedMultiplier;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * speedMultiplier;

        // Reset if drifted too high
        if (positions[i * 3 + 1] > 3.8) {
          positions[i * 3 + 1] = -3.2;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Decay click pulse
      if (pulseRef.current > 0.001) {
        pulseRef.current *= 0.92;
      } else {
        pulseRef.current = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      // Dispose Three.js resources safely
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Trigger pulse on click
  const handleForgeClick = () => {
    pulseRef.current = 1.0;
  };

  return (
    <div 
      className={`relative w-full h-[460px] md:h-[540px] lg:h-[600px] flex items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleForgeClick}
    >
      {/* Subtle background glow aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[320px] h-[320px] md:w-[420px] md:h-[420px] rounded-full bg-cyan-500/15 blur-[100px] animate-pulse-glow" />
        <div className="w-[260px] h-[260px] rounded-full bg-violet-600/15 blur-[80px] -translate-y-8" />
      </div>

      {/* WebGL Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        title="Interactive 3D Digital Forge: Drag to rotate, click to pulse"
      />

      {/* Floating Micro-hud overlays for high-tech SaaS feel */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOverdrive(!isOverdrive);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all duration-300 border ${
            isOverdrive 
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
              : 'bg-slate-900/60 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
          } backdrop-blur-md`}
        >
          <Zap className={`w-3.5 h-3.5 ${isOverdrive ? 'animate-bounce text-cyan-400' : ''}`} />
          <span>{isOverdrive ? 'OVERDRIVE: ACTIVE' : '3D ACCELERATE'}</span>
        </button>
      </div>

      {/* Bottom status indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-slate-400 pointer-events-none transition-opacity duration-300 opacity-80 hover:opacity-100">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>CORE // STABLE • 60 FPS • INTERACTIVE</span>
      </div>

      {/* Floating Card Badges around the forge */}
      <div className="absolute top-16 left-4 md:left-8 z-20 pointer-events-none hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 backdrop-blur-md text-xs text-slate-200 shadow-xl animate-float-slow">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="font-medium">Real-time WebGPU Shader</span>
      </div>

      <div className="absolute bottom-20 right-4 md:right-8 z-20 pointer-events-none hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 backdrop-blur-md text-xs text-slate-200 shadow-xl animate-float-slow" style={{ animationDelay: '1.5s' }}>
        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        <span className="font-medium">Continuous Forge Sync</span>
      </div>
    </div>
  );
};
