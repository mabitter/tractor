import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

let camera;
let controls;
let scene;
let renderer;
let tractorMesh;
let xAxis;

const simUpdater = {
  socket: null,

  start() {
    const url = "ws://localhost:8989/simsocket";
    simUpdater.socket = new WebSocket(url);
    simUpdater.socket.onmessage = (event) => {
      simUpdater.showMessage(JSON.parse(event.data));
    };
  },

  showMessage(message) {
    const p = message.world_translation_tractor;
    const q = message.world_quaternion_tractor;
    tractorMesh.position.set(p[0], p[1], p[2]);
    tractorMesh.quaternion.set(q[0], q[1], q[2], q[3]);
    xAxis.position.set(p[0], p[1], p[2]);
    xAxis.quaternion.set(q[0], q[1], q[2], q[3]);
  }
};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);
  scene.fog = new THREE.FogExp2(0xcccccc, 0.02);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.001,
    500
  );
  camera.up.set(0, 0, 1);
  camera.position.set(2.5, 2.5, 2.5);
  camera.updateMatrix();

  camera.updateMatrix();

  const size = 400;
  const divisions = 400;

  const grid = new THREE.GridHelper(size, divisions);
  grid.geometry.rotateX(-Math.PI / 2);
  scene.add(grid);

  // controls

  controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 0.1;
  controls.maxDistance = 100;

  controls.maxPolarAngle = Math.PI / 2;

  // world

  const loader = new STLLoader();
  loader.load("stl/tractor.v0.stl", (geometry) => {
    const material = new THREE.MeshPhongMaterial({
      color: 0xff5533,
      specular: 0x111111,
      shininess: 200
    });
    tractorMesh = new THREE.Mesh(geometry, material);

    tractorMesh.position.set(0, 0, 0);
    tractorMesh.rotation.set(0, 0, 0);
    tractorMesh.scale.set(0.001, 0.001, 0.001);

    tractorMesh.castShadow = true;
    tractorMesh.receiveShadow = true;
    scene.add(tractorMesh);

    xAxis = new THREE.AxesHelper();
    // var x_axis = new THREE.ArrowHelper( THREE.Vector(1,0,0), THREE.Vector3( 0, 0, 0 ), length, 0xff0000 );
    scene.add(xAxis);
    // var y_axis = new THREE.ArrowHelper( new THREE.Vector(0,1,0), new THREE.Vector3( 0, 0, 0 ), length, 0x00ff00 );
    // scene.add(y_axis);
    // var z_axis = new THREE.ArrowHelper( new THREE.Vector(0,0,1), new THREE.Vector3( 0, 0, 0 ), length, 0x0000ff );
    // scene.add(z_axis);
  });

  // lights

  const light1 = new THREE.DirectionalLight(0xffffff);
  light1.position.set(1, 1, 1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0x002288);
  light2.position.set(-1, -1, -1);
  scene.add(light2);

  const light3 = new THREE.AmbientLight(0x222222);
  scene.add(light3);

  //

  window.addEventListener("resize", onWindowResize, false);
  simUpdater.start();
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  render();
}

init();
animate();
