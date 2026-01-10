import { initScene } from './scene.js';
import { loadModels } from './components.js';
import * as THREE from 'three';

const { scene, camera, renderer } = initScene();
let cap;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Animation States
let targetX = 20; 
let targetScale = 2;
let isSpinning = false;
let baseScale = 2; // Helper to store responsive base scale

// Helper to calculate responsive position and scale
function updateResponsiveLayout() {
    const width = window.innerWidth;

    if (width < 600) { // Mobile
        // In mobile, we usually want the model centered or slightly offset
        // We also use smaller targetX values because the FOV is narrower
        targetX = 0; 
        baseScale = 1.2;
    } else if (width < 1024) { // Tablet
        targetX = 2;
        baseScale = 1.6;
    } else { // Desktop
        targetX = 4;
        baseScale = 2.2;
    }

    // Update current targetScale to match new baseScale
    targetScale = baseScale;
}

loadModels(scene, (model) => {
    cap = model;
    cap.visible = false;
    updateResponsiveLayout(); // Initialize scale/pos once loaded
});

// 1. Background and Visibility Logic
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.body.className = `bg-${entry.target.id}`;
            
            if (entry.target.id === 'education' || entry.target.id === 'projects') {
                updateResponsiveLayout(); // Recalculate based on current window size
                if (cap) cap.visible = true;
            } else {
                targetX = 20; // Move far off-screen
            }
        }
    });
}, { threshold: 0.5 });

sections.forEach(s => observer.observe(s));

// 2. Window Resize Listener (CRITICAL FOR RESPONSIVENESS)
window.addEventListener('resize', () => {
    // Update Camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Update Cap Position Logic
    const currentSection = document.body.className;
    if (currentSection.includes('education') || currentSection.includes('projects')) {
        updateResponsiveLayout();
    }
});

// 3. Click Logic
window.addEventListener('click', () => {
    if (cap && cap.visible && !isSpinning) {
        // Check if mouse is over cap using raycaster
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(cap, true);
        if (intersects.length > 0) {
            isSpinning = true;
            spin360();
        }
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

// 4. Optimized Animation Loop
function animate() {
    requestAnimationFrame(animate);

    if (cap) {
        // Smooth Movement (Lerp)
        cap.position.x = THREE.MathUtils.lerp(cap.position.x, targetX, 0.05);

        // Hide when off-screen
        if (targetX === 20 && cap.position.x > 18) {
            cap.visible = false;
        }

        if (cap.visible) {
            // Hover Detection for Scaling
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(cap, true);
            
            // Hover effect adds to the responsive base scale
            const hoverScale = (intersects.length > 0) ? baseScale * 1.2 : baseScale;

            // Scale LERP
            const s = THREE.MathUtils.lerp(cap.scale.x, hoverScale, 0.1);
            cap.scale.set(s, s, s);

            // Scroll Rotation
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