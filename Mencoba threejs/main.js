let scene, camera, renderer, cube, cone, cylinder, torus, sphere, octahedron, circle, torusKnot, tetrahedron;

function LightFunc(Light) {
  plight.visible = true;
  dlight.visible = false;
  if (document.getElementById("Change_Light").checked) {
    plight.visible = false;
    dlight.visible = true;
  }
  renderer.render(scene, camera);
}
let createCircle = function () {
  let geometry = new THREE.CircleGeometry(0.5, 100);
  let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  circle = new THREE.Mesh(geometry, material);
  scene.add(circle);
  circle.position.set(-2, 2, 0);
};

let createTorusKnot = function () {
  let geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 20);
  let material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
  torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);
  torusKnot.position.set(0, 2, 0);
};

let createCube = () => {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00a1cb });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.set(2, 2, 0);
};

let createCone = () => {
  let geometry = new THREE.ConeGeometry(0.5, 1, 16);
  let material = new THREE.MeshPhongMaterial({ color: 0xaa4400, shininess: 150 });
  cone = new THREE.Mesh(geometry, material);
  scene.add(cone);
  cone.position.set(-2, 0, 0);
};

let createCylinder = () => {
  let geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
  let material = new THREE.MeshLambertMaterial({ color: 0x448800, emissive: 0x0 });
  cylinder = new THREE.Mesh(geometry, material);
  scene.add(cylinder);
  cylinder.position.set(0, 0, 0);
};

let createTetrahedron = function () {
  let geometry = new THREE.TetrahedronGeometry(0.5);
  let material = new THREE.MeshPhysicalMaterial({ color: 0x9b1818 });
  tetrahedron = new THREE.Mesh(geometry, material);
  scene.add(tetrahedron);
  tetrahedron.position.set(2, 0, 0);
};

let createTorus = () => {
  let geometry = new THREE.TorusGeometry(0.5, 0.15, 8, 16);
  let material = new THREE.MeshPhongMaterial({ color: 0x880044, shininess: 150 });
  torus = new THREE.Mesh(geometry, material);
  scene.add(torus);
  torus.position.set(-2, -2, 0);
};

let createSphere = () => {
  let geometry = new THREE.SphereGeometry(0.5, 8, 8);
  let material = new THREE.MeshDistanceMaterial({ color: 0x990099 });
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
  sphere.position.set(0, -2, 0);
};

let createOctahedron = () => {
  let geometry = new THREE.OctahedronGeometry(0.5);
  let material = new THREE.MeshPhongMaterial({ color: 0x0077ff, shininess: 150 });
  octahedron = new THREE.Mesh(geometry, material);
  scene.add(octahedron);
  octahedron.position.set(2, -2, 0);
};

function main() {
  // 1. create the scene

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x151515);

  // 2. create an locate the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const dLight = new THREE.DirectionalLight(0xffffff, 1);
  dLight.position.set(1, 0, 1).normalize();
  const aLight = new THREE.AmbientLight(0xffffff, 1);
  aLight.position.set(0, 0, 10);
  const pLight = new THREE.PointLight(0xffffff, 1, 100);
  pLight.position.set(-10, 0, 0);
  const hLight = new THREE.HemisphereLight(0xffffff, "#ffb703", 0.8);
  hLight.position.set(-10, 10, 20);
  const sLight = new THREE.SpotLight(0xffffff, 1, 50);
  sLight.position.set(5, 10, 10);

  const lights = [dLight, aLight, pLight, hLight, sLight];

  lights.forEach((obj) => scene.add(obj));

  lights.forEach((light) => {
    light.visible = false;
  });
  lights[0].visible = true;

  const selectedLight = document.getElementById("light");
  selectedLight.addEventListener("change", (e) => {
    const selected = e.target.value;
    lights.forEach((light) => {
      light.visible = false;
    });
    lights[selected].visible = true;
  });

  // 3. create an locate the object on the scene
  createCircle();
  createTorusKnot();
  createCube();
  createCone();
  createCylinder();
  createTetrahedron();
  createTorus();
  createSphere();
  createOctahedron();

  // 4. create the renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  // main animation loop - calls 50-60 in a second.
  let mainLoop = function () {
    renderer.render(scene, camera);

    circle.rotation.x += 0.01;
    circle.rotation.y += 0.01;

    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y -= 0.01;

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    cone.rotation.x -= 0.01;
    cone.rotation.y += 0.01;

    cylinder.rotation.x += 0.01;
    cylinder.rotation.y -= 0.01;

    tetrahedron.rotation.x -= 0.01;
    tetrahedron.rotation.y -= 0.01;

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;

    sphere.rotation.x -= 0.01;
    sphere.rotation.y -= 0.01;

    octahedron.rotation.x += 0.01;
    octahedron.rotation.y += 0.01;

    requestAnimationFrame(mainLoop);
  };

  mainLoop();
}

