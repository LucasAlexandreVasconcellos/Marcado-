import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Scene3DProps {
  activeField?: string | null;
  isSuccess?: boolean;
  isHovered?: boolean;
}

export default function Scene3D({ activeField, isSuccess, isHovered }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x2a2a2b, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const amberRimLight = new THREE.DirectionalLight(0xfabc4d, 4.5);
    amberRimLight.position.set(-4, -2, -3);
    scene.add(amberRimLight);

    const fillLight = new THREE.DirectionalLight(0x8f9194, 1.2);
    fillLight.position.set(0, -5, 2);
    scene.add(fillLight);

    // 3. Materials
    const darkMetalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a1c,
      metalness: 0.92,
      roughness: 0.22,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      reflectivity: 0.8,
    });

    const amberAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xfabc4d,
      emissive: 0xbd8718,
      emissiveIntensity: 1.4,
      metalness: 0.5,
      roughness: 0.2,
    });

    const transparentCartridgeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x353436,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5,
    });

    const chromeNeedleMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0f2,
      metalness: 0.98,
      roughness: 0.08,
    });

    const jetBlackInkMaterial = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.05,
      metalness: 0.1,
    });

    const cableMaterial = new THREE.MeshStandardMaterial({
      color: 0x111112,
      roughness: 0.6,
      metalness: 0.2,
    });

    // 4. Procedural Rotary Pen Construction
    const penGroup = new THREE.Group();

    // Motor body (rear upper cylinder)
    const motorGeo = new THREE.CylinderGeometry(0.36, 0.36, 1.6, 32);
    const motorMesh = new THREE.Mesh(motorGeo, darkMetalMaterial);
    motorMesh.position.y = 1.0;
    penGroup.add(motorMesh);

    // Rear Top Cap
    const capGeo = new THREE.SphereGeometry(0.36, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const capMesh = new THREE.Mesh(capGeo, darkMetalMaterial);
    capMesh.position.y = 1.8;
    penGroup.add(capMesh);

    // Amber Emissive Accent Ring
    const accentRingGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.12, 32);
    const accentRingMesh = new THREE.Mesh(accentRingGeo, amberAccentMaterial);
    accentRingMesh.position.y = 0.15;
    penGroup.add(accentRingMesh);

    // Ergonomic Grip with annular grooves
    const gripGeo = new THREE.CylinderGeometry(0.33, 0.35, 1.4, 32);
    const gripMesh = new THREE.Mesh(gripGeo, darkMetalMaterial);
    gripMesh.position.y = -0.6;
    penGroup.add(gripMesh);

    // Grip rings
    for (let i = 0; i < 4; i++) {
      const ringGeo = new THREE.TorusGeometry(0.35, 0.02, 16, 32);
      const ringMesh = new THREE.Mesh(ringGeo, darkMetalMaterial);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = -0.3 - i * 0.22;
      penGroup.add(ringMesh);
    }

    // Transparent needle cartridge tip
    const cartridgeGeo = new THREE.ConeGeometry(0.33, 0.9, 32);
    const cartridgeMesh = new THREE.Mesh(cartridgeGeo, transparentCartridgeMaterial);
    cartridgeMesh.position.y = -1.75;
    cartridgeMesh.rotation.x = Math.PI;
    penGroup.add(cartridgeMesh);

    // Fine Needle Cone
    const needleGeo = new THREE.ConeGeometry(0.06, 0.5, 16);
    const needleMesh = new THREE.Mesh(needleGeo, chromeNeedleMaterial);
    needleMesh.position.y = -2.3;
    needleMesh.rotation.x = Math.PI;
    penGroup.add(needleMesh);

    // Ink Droplet at needle tip
    const dropletGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const dropletMesh = new THREE.Mesh(dropletGeo, jetBlackInkMaterial);
    dropletMesh.position.y = -2.55;
    penGroup.add(dropletMesh);

    // Curving RCA Cable
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.8, 0),
      new THREE.Vector3(0.2, 2.3, -0.2),
      new THREE.Vector3(0.8, 2.7, -0.6),
      new THREE.Vector3(1.6, 2.4, -1.2),
      new THREE.Vector3(2.2, 1.0, -1.8),
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 32, 0.08, 12, false);
    const cableMesh = new THREE.Mesh(cableGeo, cableMaterial);
    penGroup.add(cableMesh);

    // 5. Instanced Ink Particles floating gracefully
    const particleCount = 70;
    const particleGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xfabc4d,
      emissive: 0xbd8718,
      emissiveIntensity: 0.8,
      roughness: 0.3,
    });
    const instancedParticles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const dummy = new THREE.Object3D();
    const particlePositions: { x: number; y: number; z: number; speed: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const p = {
        x: (Math.random() - 0.5) * 4.5,
        y: (Math.random() - 0.5) * 5.5,
        z: (Math.random() - 0.5) * 3.5,
        speed: 0.2 + Math.random() * 0.8,
      };
      particlePositions.push(p);
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(0.4 + Math.random() * 0.8);
      dummy.updateMatrix();
      instancedParticles.setMatrixAt(i, dummy.matrix);
    }
    instancedParticles.instanceMatrix.needsUpdate = true;
    scene.add(instancedParticles);

    // Initial Pen Pose (editorial angle)
    penGroup.rotation.z = THREE.MathUtils.degToRad(32);
    penGroup.rotation.x = THREE.MathUtils.degToRad(-15);
    penGroup.rotation.y = THREE.MathUtils.degToRad(18);
    scene.add(penGroup);

    // 6. Pointer & Parallax tracking
    let targetRotX = penGroup.rotation.x;
    let targetRotY = penGroup.rotation.y;
    let targetRotZ = penGroup.rotation.z;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const rect = container.getBoundingClientRect();
      const normX = (clientX - rect.left) / rect.width - 0.5;
      const normY = (clientY - rect.top) / rect.height - 0.5;

      targetRotY = THREE.MathUtils.degToRad(18) + normX * 0.6;
      targetRotX = THREE.MathUtils.degToRad(-15) + normY * 0.5;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // 7. Pause when outside viewport via IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 8. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Gentle levitation float
      penGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Micro-vibration (simulating rotary tattoo machine motor)
      const motorFreq = isHovered ? 80 : 45;
      const vibrationAmp = isHovered ? 0.006 : 0.002;
      penGroup.position.x = Math.sin(elapsedTime * motorFreq) * vibrationAmp;
      penGroup.position.z = Math.cos(elapsedTime * motorFreq) * vibrationAmp;

      // Smooth lerp rotation toward target pointer angle
      penGroup.rotation.x += (targetRotX - penGroup.rotation.x) * 0.06;
      penGroup.rotation.y += (targetRotY - penGroup.rotation.y) * 0.06;
      penGroup.rotation.z += (targetRotZ - penGroup.rotation.z) * 0.06;

      // Particle subtle upward Brownian drift
      for (let i = 0; i < particleCount; i++) {
        const p = particlePositions[i];
        p.y += 0.004 * p.speed;
        if (p.y > 3) p.y = -3;
        dummy.position.set(p.x, p.y + Math.sin(elapsedTime + i) * 0.05, p.z);
        dummy.updateMatrix();
        instancedParticles.setMatrixAt(i, dummy.matrix);
      }
      instancedParticles.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      scene.clear();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isHovered]);

  return <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />;
}
