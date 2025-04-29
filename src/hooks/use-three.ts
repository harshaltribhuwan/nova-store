import { useCallback } from 'react';
import * as THREE from 'three';

export function useThree() {
  // Setup Three.js for hero section
  const setupThreeJSHero = useCallback((container: HTMLDivElement) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      container.offsetWidth / container.offsetHeight, 
      0.1, 
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // Create a torus knot
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xFF3366,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x330011,
      emissiveIntensity: 0.5
    });
    
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    // Add lights
    const pointLight = new THREE.PointLight(0xFFFFFF, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    const ambientLight = new THREE.AmbientLight(0x6600FF, 0.5);
    scene.add(ambientLight);
    
    camera.position.z = 30;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      torusKnot.rotation.x += 0.01;
      torusKnot.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Resize handler
    const handleResize = () => {
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      scene.remove(torusKnot);
    };
  }, []);

  // Setup Three.js for product detail view 
  const setupThreeJSProductViewer = useCallback((container: HTMLDivElement, imageUrl: string) => {
    // For demonstration, we'll create a 3D card effect with the product image
    // In a production app, you would load an actual 3D model
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // Create a plane with the product image as a texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl);
    
    const geometry = new THREE.PlaneGeometry(15, 15);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    
    // Add lights
    const pointLight = new THREE.PointLight(0xFFFFFF, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xFF3366, 0.5);
    pointLight2.position.set(-5, -5, 3);
    scene.add(pointLight2);
    
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(ambientLight);
    
    camera.position.z = 20;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Subtle floating animation
      plane.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
      plane.position.y = Math.sin(Date.now() * 0.001) * 0.2;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Interactive rotation with mouse
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 2 - 1;
      const y = -((e.clientY - top) / height) * 2 + 1;
      
      plane.rotation.y = x * 0.3;
      plane.rotation.x = y * 0.3;
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    
    // Resize handler
    const handleResize = () => {
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      scene.remove(plane);
    };
  }, []);

  // Setup particles background
  const setupParticlesBackground = useCallback((container: HTMLDivElement) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xFF3366,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0003;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      scene.remove(particlesMesh);
    };
  }, []);

  return { 
    setupThreeJSHero,
    setupThreeJSProductViewer,
    setupParticlesBackground
  };
}
