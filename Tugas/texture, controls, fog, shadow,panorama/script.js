(function init() {
  let camera, sphere, cube, plane;
  const canvas = document.querySelector("canvas.webgl");

  //========== Buat Scene

  const scene = new THREE.Scene();

  const panorama = new THREE.CubeTextureLoader();
  const textureBg = panorama.load(["image/posx.jpg", "image/negx.jpg", "image/posy.jpg", "image/negy.jpg", "image/posz.jpg", "image/negz.jpg"]);
  scene.background = textureBg;

  scene.fog = new THREE.Fog(0xff0000, 3, 2);

  //========== Create Lighting
  const dirLight1 = new THREE.DirectionalLight(0xffffff);
  dirLight1.position.set(-700, 700, 100);
  dirLight1.castShadow = true;

  dirLight1.shadow.mapSize.width = 1024;
  dirLight1.shadow.mapSize.height = 512;

  dirLight1.shadow.camera.near = 100;
  dirLight1.shadow.camera.far = 1200;

  dirLight1.shadow.camera.left = -1000;
  dirLight1.shadow.camera.right = 1000;
  dirLight1.shadow.camera.top = 350;
  dirLight1.shadow.camera.bottom = -350;

  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x002288);
  dirLight2.position.set(-1, -1, -1);
  scene.add(dirLight2);

  const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.2);
  dirLight3.position.set(1500, 900, 100);
  dirLight3.castShadow = true;

  dirLight3.shadow.mapSize.width = 1024;
  dirLight3.shadow.mapSize.height = 512;
  dirLight3.shadow.camera.near = 100;
  dirLight3.shadow.camera.far = 1200;

  dirLight3.shadow.camera.left = -1000;
  dirLight3.shadow.camera.right = 1000;
  dirLight3.shadow.camera.top = 350;
  dirLight3.shadow.camera.bottom = -350;

  scene.add(dirLight3);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  //=========== Create Geometry
  const loader = new THREE.TextureLoader();
  let cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
  //texture
  let cubeMaterial = new THREE.MeshBasicMaterial({
    map: loader.load("image/rubik.png"),
  });
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
  cube.position.set(100, 10, 2);

  let planeGeometry = new THREE.PlaneGeometry(1600, 1600);
  let planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
  plane.position.set(5, -2, 3);

  // ====== Reflecting

  const createSphere = (radius, heightSeg, widthSeg, color = Math.random() * 0xffffff) => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, heightSeg, widthSeg), new THREE.MeshPhongMaterial({ color: color }));

    sphere.position.set(5, 0, 2);
    return sphere;
  };
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  });

  // Create cube camera
  const cubeCamera = new THREE.CubeCamera(1, 100000, cubeRenderTarget);
  cubeCamera.position.set(0, 0, 0);
  scene.add(cubeCamera);

  const reflectSphere = new THREE.Mesh(
    new THREE.SphereGeometry(32, 150, 150),
    new THREE.MeshLambertMaterial({
      color: 0xffffff,
      envMap: cubeRenderTarget.texture,
    })
  );
  reflectSphere.position.set(5, 0, 2);
  scene.add(reflectSphere);

  // ====== Sizing
  const sizes = {
    width: 0.9 * window.innerWidth,
    height: 0.9 * window.innerHeight,
  };

  //========= Pengaturan Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 4000);
  camera.position.set(0, 60, 130);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.enableZoom = false;
  controls.dampingFactor = 0.5;
  controls.enableDamping = true;
  controls.enableRotate = true;

  //============= Render
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antiAlias: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //=========== Interactive Action
  // Sizing canvas
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = 0.9 * window.innerWidth;
    sizes.height = 0.9 * window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  const mainLoop = () => {
    renderer.render(scene, camera);
    controls.update();
    cube.rotation.y += 0.01;
    cube.rotation.x += 0.01;

    reflectSphere.visible = false;

    cubeCamera.update(renderer, scene);
    reflectSphere.visible = true;
    requestAnimationFrame(mainLoop);
  };

  mainLoop();
})();
