import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadModels(scene, callback) {
    const loader = new GLTFLoader();
    
    // Using a relative path that works for most dev servers
    loader.load('./public/assets/graduation-cap.glb', (gltf) => {
        const cap = gltf.scene;
        
        // Initial setup
        cap.scale.set(1, 1, 1);
        cap.position.set(20, 0, 0); // Start off-screen
        
        scene.add(cap);
        callback(cap);
    }, 
    undefined, 
    (err) => console.error('Error loading model. Check if path is correct:', err));
}