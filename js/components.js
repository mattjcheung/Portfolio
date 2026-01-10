import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadModels(scene, callback) {
    const loader = new GLTFLoader();
    loader.load('./public/assets/graduation-cap.glb', (gltf) => {
        const cap = gltf.scene;
        cap.scale.set(1, 1, 1);
        cap.position.set(10, 0, 0);
        scene.add(cap);
        callback(cap);
    }, undefined, (err) => console.error('Error loading model:', err));
}