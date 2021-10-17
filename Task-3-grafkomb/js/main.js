function main() {
  alert("Petunjuk :\nPilih 2 objek dengan warna yang sama!");
  let scene, camera, renderer, controls, rayCast;

  let randomInRange = function (from, to) {
    let x = Math.random() * (to - from);
    return x + from;
  };

  let createCube = function () {
    let geometry = new THREE.BoxGeometry(3, 3, 3);

    // warna untuk cube ada 5 jenis
    const colorList = [0xf99999, 0xf95b5b, 0x845bf9, 0x5bc9f9, 0x5ef95b];
    let color = colorList[Math.floor(randomInRange(0, 5))];
    let emissive = color + 0.05;

    let material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: emissive,
      shineness: 100,
    });
    cube = new THREE.Mesh(geometry, material);

    // posisi cube
    cube.position.x = randomInRange(-25, 25);
    cube.position.y = randomInRange(-25, 25);
    cube.position.z = randomInRange(-25, 25);

    // shpere dimasukkan ke scene
    scene.add(cube);
  };

  let scoreCorrect = 40;
  let scoreWrong = -20;
  let currentScore = 0;
  let highScore = 0;
  let elementScore = document.getElementById("score");
  let elementHighScore = document.getElementById("highscore");

  let selectedObject = []; // menyimpan objek yang sudah dipilih
  let originalColors = []; // menyimpan warna asli yang sudah di generate

  let onMouseClick = function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouse.z = 1;

    rayCast.setFromCamera(mouse, camera);

    let intersects = rayCast.intersectObjects(scene.children, false);

    if (intersects.length == 0) {
      // kondisi jika objek tidak berhasil diambil
      return;
    } else {
      selectedObject.push(intersects);
      originalColors.push(intersects[0].object.material.color.getHex());

      console.log(intersects);
      console.log(originalColors);
      console.log(selectedObject);

      // kondisi objek yang dipilih lebih dari satu
      if (selectedObject.length > 1) {
        // kondisi jika objek sama atau tidak
        if (selectedObject[0][0].object.uuid === selectedObject[1][0].object.uuid) {
          selectedObject[0][0].object.material.emissive.setHex(originalColors[0]);
          selectedObject[0][0].object.rotation.x = 0;
          selectedObject[0][0].object.rotation.y = 0;
        } else if (originalColors[0] == originalColors[1]) {
          selectedObject.forEach((object) => {
            object[0].object.geometry.dispose();
            object[0].object.material.dispose();
            scene.remove(object[0].object);
            renderer.renderLists.dispose();
          });

          currentScore += scoreCorrect;
          console.log(currentScore);
          elementScore.innerHTML = currentScore;
        } else {
          selectedObject[0][0].object.material.emissive.setHex(originalColors[0]);
          selectedObject[0][0].object.rotation.x = 0;
          selectedObject[0][0].object.rotation.y = 0;
          currentScore += scoreWrong;
          console.log(currentScore);
          elementScore.innerHTML = currentScore;
        }

        selectedObject = [];
        originalColors = [];
      } else if (selectedObject.length > 2) {
        // kalau objek yang dipilih lebih dari dua
        selectedObject = [];
        originalColors = [];
        return;
      }
    }
  };

  // generate cube baru
  let speed = 2500;
  const baseSpeed = 2500;

  let generateCube = function () {
    if (scene.children.length >= 56) {
      speed = baseSpeed;

      if (currentScore > highScore) {
        highScore = currentScore;
        elementHighScore.innerHTML = highScore;
      }

      currentScore = 0;
      elementScore.innerHTML = currentScore;
    } else {
      speed -= 150;
      createCube();
    }

    setTimeout(generateCube, speed);
  };

  // set up the environment -
  // initiallize scene, camera, objects and renderer
  let init = function () {
    // create the scene
    scene = new THREE.Scene();
    const Texture = new THREE.TextureLoader().load("dark.jpg");
    scene.background = Texture;

    // create an locate the camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 70;

    // untuk mengatur pencahayaan menggunakan spotlight
    var light = new THREE.SpotLight(0xfffff, 0.5);
    var light2 = new THREE.SpotLight(0xfffff, 0.5);
    scene.add(new THREE.SpotLightHelper(light)); // letak Cahaya
    scene.add(light);
    scene.add(light2);
    light.position.set(0, 30, 0);
    light2.position.set(0, -30, 0);

    // membuat dan memasukkan cube ke dalam scene
    for (let i = 1; i <= 28; i++) createCube();

    // tambah cube baru
    generateCube();

    // create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    document.addEventListener("click", onMouseClick, false);

    // control orbit
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // inisialisasi raycaster
    rayCast = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    mouse.x = mouse.y = -1;
  };
  const clock = new THREE.Clock();

  let mainLoop = function () {
    const elapsedTime = clock.getElapsedTime();

    if (selectedObject.length == 1) {
      selectedObject[0][0].object.material.emissive.setHex(elapsedTime % 0.5 >= 0.25 ? originalColors[0] : originalColors[0] * 3);
      selectedObject[0][0].object.rotation.x += 5;
      selectedObject[0][0].object.rotation.y += 5;
      selectedObject[0][0].object.rotation.z += 5;
    }

    renderer.render(scene, camera);
    controls.update();
    window.requestAnimationFrame(mainLoop);
  };

  init();
  mainLoop();
}
