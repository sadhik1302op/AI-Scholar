import React, { useEffect, useRef } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import * as THREE from 'three';

export default function AntiGravityBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !mountRef.current) return;

    // Standard Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Particle geometry
    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const r = 3 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i*3+2] = r * Math.cos(phi);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0xa78bfa,
      size: 0.015,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    
    const points = new THREE.Points(geometry, material);
    points.rotation.order = 'YXZ';
    points.rotation.z = Math.PI / 4;
    scene.add(points);

    camera.position.z = 1;

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      points.rotation.x -= 0.001;
      points.rotation.y -= 0.002;
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  if (Platform.OS !== 'web') {
      return <View style={styles.fallbackBackground} />;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
        <View style={styles.cssDepth} />
        {/* The container for the Three.js Canvas */}
        <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
    </View>
  );
}

const styles = StyleSheet.create({
    fallbackBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#0F172A',
    },
    cssDepth: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#0F172A',
        ...(Platform.OS === 'web' && { 
            backgroundImage: 'radial-gradient(circle at center, rgba(138,43,226,0.15), transparent 70%), linear-gradient(135deg, #0F172A, #1E293B)' 
        }),
    }
});
