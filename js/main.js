import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), alpha: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(5);

// 2. Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.set(5, 5, 5);
scene.add(ambientLight, pointLight);

// 3. Load Graduation Cap
let cap;
const loader = new GLTFLoader();

loader.load('../public/assets/graduation-cap.glb', (gltf) => {
    cap = gltf.scene;
    scene.add(cap);
    cap.scale.set(2, 2, 2); // Adjust size as needed
}, undefined, (error) => {
    console.error('Error loading model:', error);
});

// 4. Scroll Animation Logic
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    if (cap) {
        // Rotates based on scroll position
        cap.rotation.y = t * -0.01; 
        cap.rotation.z = t * -0.002;
    }
}
document.body.onscroll = moveCamera;

// 5. Click to Spin 360 Logic
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isSpinning = false;

window.addEventListener('click', (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0 && !isSpinning) {
        isSpinning = true;
        spinObject();
    }
});

function spinObject() {
    const startRotation = cap.rotation.y;
    const targetRotation = startRotation + Math.PI * 2; // 360 degrees
    
    const duration = 1000; // 1 second
    const startTime = performance.now();

    function animateSpin(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for a smooth spin
        const ease = 1 - Math.pow(1 - progress, 3); 
        
        cap.rotation.y = startRotation + (targetRotation - startRotation) * ease;

        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            isSpinning = false;
        }
    }
    requestAnimationFrame(animateSpin);
}

// 6. Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});