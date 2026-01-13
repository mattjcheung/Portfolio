import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

// Torus - MADE SMALLER (Radius 10 -> 6)
const geometry = new THREE.TorusGeometry(6, 2, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Stars
const stars = [];

function addStar() {
  const geometry = new THREE.IcosahedronGeometry(0.12, 0);

  // 1. Define the possible colors
  const colors = [
    0xffffff, // White
    0xffd1dc, // Light Pink
    0xe0b0ff,  // Light Purple (Mauve)
    0xffeb96,  // Light Yellow
  ];

  // 2. Randomly select one color from the array
  const selectedColor = colors[Math.floor(Math.random() * colors.length)];

  const material = new THREE.MeshStandardMaterial({
    color: selectedColor, // Use the random color here
    flatShading: true,
    roughness: 0.9,
    emissive: new THREE.Color(selectedColor), // Match emissive color for the glow
    emissiveIntensity: 0.4
  });

  const star = new THREE.Mesh(geometry, material);

  // Determine spawn position
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(150));
  star.position.set(x, y, z);

  star.userData = {
    baseEmissive: material.emissiveIntensity,
    twinkleSpeed: THREE.MathUtils.randFloat(0.6, 2.0),
    twinkleOffset: Math.random() * Math.PI * 2,
    baseScale: star.scale.x
  };

  stars.push(star);
  scene.add(star);
}

Array(2000).fill().forEach(addStar);

// Background Colors
const startColor = new THREE.Color(0x1b2647); 
const midColor   = new THREE.Color(0x131d3b); 
const endColor   = new THREE.Color(0x0b031f); 
scene.background = startColor;
scene.fog = new THREE.Fog(0x1b2647, 10, 40);

// ===== 3D MODEL LOADING =====
const loader = new GLTFLoader();
let cow;
let gradCap;
let car;

// 1. GRADUATION CAP (Now encountered FIRST and on the RIGHT)
loader.load('assets/graduation-cap.glb', function (gltf) {
  gradCap = gltf.scene;
  // SIZE: Smaller scale (5 -> 2.5)
  gradCap.scale.set(2.5, 2.5, 2.5); 
  // POSITION: Encoutered first (z=12) and moved to the Right (x=10)
  gradCap.position.set(2, 0, 20); 
  scene.add(gradCap);
});

// 2. COW (Now encountered SECOND and on the LEFT)
loader.load('assets/cow.glb', function (gltf) {
  cow = gltf.scene;
  // SIZE: Smaller scale (3 -> 1.5)
  cow.scale.set(1.5, 1.5, 1.5); 
  // POSITION: Encountered later (z=40) and on the Left (x=-10)
  cow.position.set(-10, 0, 40); 
  scene.add(cow);
});

// 3. CAR (Encountered LAST)
loader.load('assets/car.glb', function (gltf) {
  car = gltf.scene;
  // Size: 1/10th of your original 0.5 request
  car.scale.set(1, 1, 1); 
  // Position: Further down (z=60) and slightly to the right
  car.position.set(-2, 16, 60); 
  scene.add(car);
});


// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  if (cow) {
    cow.rotation.y += 0.05;
  }
  if (gradCap) {
    gradCap.rotation.y += 0.05;
    gradCap.rotation.z += 0.02;
  }
  if (car) {
    car.rotation.y += 0.05;
    car.rotation.x += 0.02;
  }

  camera.position.z = t * -0.02;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

  const scrollY = window.scrollY;
  const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = Math.min(scrollY / (scrollMax || 1), 1);

  let bgColor = (scrollProgress < 0.5) 
    ? startColor.clone().lerp(midColor, scrollProgress * 2) 
    : midColor.clone().lerp(endColor, (scrollProgress - 0.5) * 2);

  scene.background = bgColor;
  scene.fog.color = bgColor;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  const time = performance.now() * 0.001;

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;

  if (cow) {
    cow.rotation.y += 0.005;
    cow.position.y = Math.sin(time) * 0.5;
  }
  if (gradCap) {
    gradCap.rotation.y += 0.005;
    gradCap.position.y = Math.sin(time + 1) * 0.5;
  }
  if (car) {
    car.rotation.z += 0.01;
    car.position.y = Math.sin(time + 2) * 0.5; // Bobs at a different rhythm
  }

  stars.forEach((star) => {
    const { baseEmissive, twinkleSpeed, twinkleOffset, baseScale } = star.userData;
    const twinkle = Math.sin(time * twinkleSpeed + twinkleOffset) * 0.6;
    star.material.emissiveIntensity = baseEmissive + Math.max(0, twinkle) * 1.8;
    const scale = baseScale * (1 + Math.max(0, twinkle) * 0.25);
    star.scale.set(scale, scale, scale);
  });

  renderer.render(scene, camera);
}

animate();