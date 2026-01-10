import { initScene } from './scene.js';
import { loadModels } from './components.js';
import * as THREE from 'three';

const { scene, camera, renderer } = initScene();
let cap;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Animation States
let targetX = 20;        // Moved further out (20 instead of 10) to ensure it's hidden
let targetScale = 2;
let isSpinning = false;

loadModels(scene, (model) => {
    cap = model;
    cap.visible = false; // Start completely hidden
});

// 1. Background and Visibility Logic
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.body.className = `bg-${entry.target.id}`;
            
            if (entry.target.id === 'education') {
                targetX = 2; // Target position in view
                if (cap) cap.visible = true; // Turn on rendering immediately
            } else {
                targetX = 20; // Target position far off-screen
            }
        }
    });
}, { threshold: 0.5 });

sections.forEach(s => observer.observe(s));

// 2. Click Logic (Only if visible)
window.addEventListener('click', () => {
    if (cap && cap.visible && targetScale > 2 && !isSpinning) {
        isSpinning = true;
        spin360();
    }
});

function spin360() {
    const startRotation = cap.rotation.y;
    const targetRotation = startRotation + Math.PI * 2;
    const duration = 1000;
    const startTime = performance.now();

    function animateSpin(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
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

// 3. Optimized Animation Loop
function animate() {
    requestAnimationFrame(animate);

    if (cap) {
        // Move X position
        cap.position.x = THREE.MathUtils.lerp(cap.position.x, targetX, 0.05);

        // PERFORMANCE CHECK: If the cap is far off-screen and we are moving away, hide it
        if (targetX === 20 && cap.position.x > 18) {
            cap.visible = false;
        }

        // Only run interaction logic if the cap is visible
        if (cap.visible) {
            // Hover Detection
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(cap, true);
            targetScale = (intersects.length > 0) ? 2.4 : 2.0;

            // Scale LERP
            const s = THREE.MathUtils.lerp(cap.scale.x, targetScale, 0.1);
            cap.scale.set(s, s, s);

            // Scroll Rotation (only if not clicking)
            if (!isSpinning) {
                const t = document.body.getBoundingClientRect().top;
                cap.rotation.y = t * -0.002;
            }
        }
    }

    renderer.render(scene, camera);
}

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

animate();