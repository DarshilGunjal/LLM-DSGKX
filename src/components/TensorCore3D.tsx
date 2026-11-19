"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function TensorCore3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const pulseTriggerRef = useRef<number>(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // Group to hold all 3D objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Geodesic Tensor Core (Icosahedron wireframe)
    const coreGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xff3b00,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Inner glowing solid geometric nucleus
    const innerGeo = new THREE.OctahedronGeometry(2.0, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xf2efe9,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 2. High-Dimensional Token Embedding Particles
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorOrange = new THREE.Color(0xff3b00);
    const colorWhite = new THREE.Color(0xf2efe9);

    for (let i = 0; i < particleCount; i++) {
      // Distribute in spherical shell around tensor core
      const radius = 5.2 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color mix: mostly white/faint with orange attention clusters
      const mixRatio = Math.random() > 0.75 ? 1 : Math.random() * 0.3;
      const col = colorWhite.clone().lerp(colorOrange, mixRatio);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // 3. Dynamic Attention Ray Lines (connecting nodes across 3D space)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xff3b00,
      transparent: true,
      opacity: 0.22,
    });

    const lineCount = 120;
    const linePositions = new Float32Array(lineCount * 6); // 2 points per line (start + end)

    // Form random pairwise attention connections between nearby nodes
    for (let i = 0; i < lineCount; i++) {
      const idxA = Math.floor(Math.random() * particleCount);
      let idxB = Math.floor(Math.random() * particleCount);
      if (idxA === idxB) idxB = (idxB + 1) % particleCount;

      linePositions[i * 6] = positions[idxA * 3];
      linePositions[i * 6 + 1] = positions[idxA * 3 + 1];
      linePositions[i * 6 + 2] = positions[idxA * 3 + 2];

      linePositions[i * 6 + 3] = positions[idxB * 3];
      linePositions[i * 6 + 4] = positions[idxB * 3 + 1];
      linePositions[i * 6 + 5] = positions[idxB * 3 + 2];
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    mainGroup.add(lines);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const w = rect.width || width || 800;
      const h = rect.height || height || 500;
      const normX = ((e.clientX - rect.left) / w) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / h) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        mainGroup.rotation.y += deltaX * 0.008;
        mainGroup.rotation.x += deltaY * 0.008;
      } else {
        targetRotationY = normX * 0.8;
        targetRotationX = -normY * 0.8;
      }

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };
    window.addEventListener("resize", onResize);

    // Pulse wave animation variable
    let pulseWave = 0;

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth camera / target rotation
      if (!isDragging) {
        mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05 + 0.003;
        mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;
      }

      // Counter-rotate inner nucleus for complex mechanical motion
      innerMesh.rotation.x -= 0.01;
      innerMesh.rotation.y += 0.015;
      coreMesh.rotation.z += 0.002;

      // Handle synaptic shockwave pulses
      if (pulseTriggerRef.current > 0) {
        pulseWave += 0.08;
        const pulseScale = 1 + Math.sin(pulseWave) * 0.15;
        coreMesh.scale.set(pulseScale, pulseScale, pulseScale);
        coreMat.opacity = 0.35 + Math.sin(pulseWave) * 0.35;
        lineMat.opacity = 0.22 + Math.sin(pulseWave) * 0.4;

        if (pulseWave >= Math.PI) {
          pulseTriggerRef.current = 0;
          pulseWave = 0;
          coreMesh.scale.set(1, 1, 1);
          coreMat.opacity = 0.35;
          lineMat.opacity = 0.22;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, []);

  const triggerPulse = () => {
    pulseTriggerRef.current = 1;
    setPulseCount((c) => c + 1);
  };

  return (
    <div className="relative w-full h-[450px] md:h-[550px] lg:h-[600px] border border-[#F2EFE9]/20 bg-[#0B0B0C] overflow-hidden select-none swiss-grid">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        data-cursor="ROTATE 3D"
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top HUD Telemetry Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none font-mono text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF3B00] animate-ping" />
            <span className="text-[#FF3B00] font-bold">[3D NEURAL TENSOR CORE]</span>
          </div>
          <div className="text-[11px] text-[#F2EFE9]/60">
            TOPOLOGY: HIGH-DIMENSIONAL SPHERE (ℝ⁴⁰⁹⁶)
          </div>
        </div>

        <div className="text-right text-[11px] text-[#F2EFE9]/50 space-y-0.5">
          <div>NODES: 280 EMBEDDINGS</div>
          <div>ATTENTION RAYS: 120 HEAD AFFINITIES</div>
          <div className="text-[#FF3B00]">PULSES: {pulseCount}</div>
        </div>
      </div>

      {/* Floating Spatial Annotation Tags in Swiss Style */}
      <div className="absolute top-24 left-6 pointer-events-none font-mono text-[10px] text-[#F2EFE9]/50 border-l border-[#FF3B00] pl-2 hidden sm:block">
        <div>// ATTENTION VECTOR Q·Kᵀ</div>
        <div className="text-[#F2EFE9]">CLUSTER: SEMANTIC COGNITION</div>
      </div>

      <div className="absolute bottom-20 right-6 pointer-events-none font-mono text-[10px] text-[#F2EFE9]/50 border-r border-[#FF3B00] pr-2 text-right hidden sm:block">
        <div>// LATENT RADIUS: R = 8.7 UNITS</div>
        <div className="text-[#FF3B00]">ROTATION MATRIX: SO(3)</div>
      </div>

      {/* Bottom Interactive HUD Action Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs border-t border-[#F2EFE9]/10 pt-3 bg-[#0B0B0C]/80 backdrop-blur px-2">
        <div className="flex items-center gap-3">
          <button
            onClick={triggerPulse}
            data-cursor="PULSE"
            className="px-3 py-1.5 bg-[#FF3B00] text-[#0B0B0C] font-bold text-xs uppercase hover:bg-[#F2EFE9] transition-colors flex items-center gap-1.5"
          >
            <span>⚡ EMIT ATTENTION PULSE</span>
          </button>

          <span className="text-[11px] text-[#F2EFE9]/60 hidden md:inline">
            CLICK &amp; DRAG TO ORBIT 3D EMBEDDINGS
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#F2EFE9]/50">
          <span>FPS: 60</span>
          <span>GPU: ACCELERATED</span>
        </div>
      </div>
    </div>
  );
}
