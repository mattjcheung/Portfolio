import * as THREE from 'three';

export function initScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector('#bg'), 
        alpha: true,
        antialias: true 
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(5);

    // Base lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    // Bright Orange Top-Left Rim Light
    const orangeLight = new THREE.DirectionalLight(0xffa500, 8); // High intensity for clarity
    orangeLight.position.set(-5, 5, 2); 
    scene.add(orangeLight);

    return { scene, camera, renderer };
}