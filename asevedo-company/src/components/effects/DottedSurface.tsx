'use client';

/**
 * DottedSurface Component
 * Three.js animated particle wave background
 * Creates an elegant futuristic dotted wave effect
 * Runs as a fixed background layer with pointer-events disabled
 */

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Store scene references for cleanup
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points[];
    animationId: number;
    count: number;
  } | null>(null);

  // Ensure component is mounted before running Three.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run if mounted and container exists
    if (!isMounted || !containerRef.current) return;

    // Configuration for the particle grid
    const SEPARATION = 150;    // Distance between particles
    const AMOUNTX = 40;        // Number of particles on X axis
    const AMOUNTY = 60;        // Number of particles on Y axis

    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    // Camera setup with perspective for depth effect
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 355, 1220);

    // Renderer with transparency support
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 0);

    containerRef.current.appendChild(renderer.domElement);

    // Generate particle positions and colors
    const positions: number[] = [];
    const colors: number[] = [];
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const y = 0;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

        positions.push(x, y, z);
        
        // Color based on theme - subtle cyan tint in dark mode
        if (theme === 'dark') {
          colors.push(0.3, 0.8, 1); // Cyan-ish for dark theme
        } else {
          colors.push(0.1, 0.3, 0.5); // Dark blue for light theme
        }
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Material for particles with transparency
    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId = 0;

    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles: [points],
      animationId: 0,
      count,
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }

      const positionAttribute = geometry.attributes.position;
      const pos = positionAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;
          // Create wave effect with combined sin waves
          pos[index + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }

      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.05; // Slower animation for elegance
    };

    /**
     * Handle window resize
     * Updates camera aspect ratio and renderer size
     */
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    /**
     * Cleanup function
     * Properly disposes of Three.js resources to prevent memory leaks
     */
    return () => {
      window.removeEventListener('resize', handleResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        // Dispose of geometries and materials
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        });

        sceneRef.current.renderer.dispose();

        // Remove canvas from DOM
        if (containerRef.current && sceneRef.current.renderer.domElement) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [theme, isMounted, pathname]);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none fixed inset-0 -z-10', className)}
      aria-hidden="true"
      {...props}
    />
  );
}
