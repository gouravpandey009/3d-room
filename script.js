// Define scene, camera, and renderer
const container = document.getElementById("container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Add orbit controls for better navigation
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Add ambient light and a point light for better illumination
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 20, 10);
pointLight.castShadow = true;
scene.add(pointLight);

// Add spotlight for dramatic effect
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(15, 40, 35);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.1;
spotLight.decay = 2;
spotLight.distance = 200;
spotLight.castShadow = true;
scene.add(spotLight);

// Create a room with textured walls
const roomSize = { width: 20, height: 10, depth: 30 };
const roomTexture = new THREE.TextureLoader().load(
  "https://threejsfundamentals.org/threejs/resources/images/wall.jpg"
);
const roomMaterial = new THREE.MeshStandardMaterial({
  map: roomTexture,
  side: THREE.BackSide,
});
const roomGeometry = new THREE.BoxGeometry(
  roomSize.width,
  roomSize.height,
  roomSize.depth
);
const room = new THREE.Mesh(roomGeometry, roomMaterial);
room.receiveShadow = true;
scene.add(room);

// Add floor with texture
const floorTexture = new THREE.TextureLoader().load(
  "https://threejsfundamentals.org/threejs/resources/images/checker.png"
);
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(10, 10);
const floorGeometry = new THREE.PlaneGeometry(roomSize.width, roomSize.depth);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate to lay flat
floor.position.y = -roomSize.height / 2;
floor.receiveShadow = true;
scene.add(floor);

// Add random interior objects with animation
const numObjects = 15;
const objectSizeRange = { min: 1, max: 3 };
const objectColors = [
  0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff,
];
const objectGeometry = new THREE.BoxGeometry();

for (let i = 0; i < numObjects; i++) {
  const objectSize =
    Math.random() * (objectSizeRange.max - objectSizeRange.min) +
    objectSizeRange.min;
  const objectMaterial = new THREE.MeshStandardMaterial({
    color: objectColors[Math.floor(Math.random() * objectColors.length)],
  });
  const object = new THREE.Mesh(objectGeometry, objectMaterial);
  object.scale.set(objectSize, objectSize, objectSize);
  object.position.x =
    Math.random() * (roomSize.width - objectSize) -
    roomSize.width / 2 +
    objectSize / 2;
  object.position.y = objectSize / 2;
  object.position.z =
    Math.random() * (roomSize.depth - objectSize) -
    roomSize.depth / 2 +
    objectSize / 2;
  object.castShadow = true;
  scene.add(object);

  // Add animation to objects
  new TWEEN.Tween(object.position)
    .to({ y: object.position.y + 2 }, 2000 + Math.random() * 3000)
    .repeat(Infinity)
    .yoyo(true)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

  // Add rotation animation to objects
  new TWEEN.Tween(object.rotation)
    .to({ y: object.rotation.y + Math.PI * 2 }, 4000 + Math.random() * 4000)
    .repeat(Infinity)
    .easing(TWEEN.Easing.Linear.None)
    .start();
}

// Position and point the camera to the center of the scene
camera.position.set(0, roomSize.height / 2, roomSize.depth / 2);
camera.lookAt(0, roomSize.height / 2, 0);

// Add animation loop
function animate(time) {
  requestAnimationFrame(animate);
  controls.update();
  TWEEN.update(time);
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
