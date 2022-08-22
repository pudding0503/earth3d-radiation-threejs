import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, skybox;
var earth, datas;
let skyboxImage = "space";

const m1Btn = document.querySelector(".m1");
const m2Btn = document.querySelector(".m2");
const m3Btn = document.querySelector(".m3");
const m4Btn = document.querySelector(".m4");
const m5Btn = document.querySelector(".m5");
const m6Btn = document.querySelector(".m6");
const m7Btn = document.querySelector(".m7");
const m8Btn = document.querySelector(".m8");
const m9Btn = document.querySelector(".m9");
const m10Btn = document.querySelector(".m10");
const m11Btn = document.querySelector(".m11");
const m12Btn = document.querySelector(".m12");
const m13Btn = document.querySelector(".m13");

m1Btn.onclick = () => changeTextMonth("m1");
m2Btn.onclick = () => changeTextMonth("m2");
m3Btn.onclick = () => changeTextMonth("m3");
m4Btn.onclick = () => changeTextMonth("m4");
m5Btn.onclick = () => changeTextMonth("m5");
m6Btn.onclick = () => changeTextMonth("m6");
m7Btn.onclick = () => changeTextMonth("m7");
m8Btn.onclick = () => changeTextMonth("m8");
m9Btn.onclick = () => changeTextMonth("m9");
m10Btn.onclick = () => changeTextMonth("m10");
m11Btn.onclick = () => changeTextMonth("m11");
m12Btn.onclick = () => changeTextMonth("m12");
m13Btn.onclick = () => changeTextMonth("m13");

function createPathStrings(filename) {
  const basePath = "https://pudding.nousbuild.com/earth3d-radiation-threejs/earth3d-demo1/earth/skybox/";
  const baseFilename = basePath + filename;
  const fileType = ".png";
  const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
  const pathStrings = sides.map((side) => {
    return baseFilename + "_" + side + fileType;
  });
  return pathStrings;
}

function createMaterialArray(filename) {
  const skyboxImagepaths = createPathStrings(filename);
  const materialArray = skyboxImagepaths.map((image) => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

// 加载宇宙背景
function setSkyBox() {
  const materialArray = createMaterialArray(skyboxImage);
  let skyboxGeo = new THREE.BoxGeometry(200, 200, 200);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}

// 加载基础地球
function setEarthBox() {
  var earth_texture = new THREE.TextureLoader().load('earth/earth_hd.jpg');
  var earth_geometry = new THREE.SphereGeometry(5, 64, 64);

  var earth_bump = new THREE.TextureLoader().load("earth/bump.jpeg");
  var earth_specular = new THREE.TextureLoader().load("earth/spec.jpeg");

  var earth_material = new THREE.MeshBasicMaterial({
    shininess: 40,
    bumpScale: 1,
    map: earth_texture,
    bumpMap: earth_bump,
    specularMap: earth_specular
  });
  earth = new THREE.Mesh(earth_geometry, earth_material);
  scene.add(earth);
}

// 地球数据（辐射）模型
function loadTexture(texture) {
  var datas_texture = new THREE.TextureLoader().load(texture);
  var datas_geometry = new THREE.SphereGeometry(5.01, 64, 64);
  var datas_material = new THREE.MeshBasicMaterial({
    shininess: 10,
    map: datas_texture,
    transparent: true,
    opacity: 0.9
  });
  datas = new THREE.Mesh(datas_geometry, datas_material);
  scene.add(datas);
}

// 加载
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // 加载宇宙背景
  setSkyBox();

  // 加载基础地球
  setEarthBox();

  // 加载辐射图
  loadTexture("earth/1.png");
  scene.add(datas);

  // 渲染设置
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0xffffff, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.id = "c";

  // 滚动设置
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 12;
  controls.maxDistance = 30;
  controls.minZoom = 30

  camera.position.z = 20;
}

// 切换辐射图函数
function changeTextMonth(month) {
  switch (month) {
    case "m1":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/1.png");
      datas.material.needsUpdate = true;
      break;
    case "m2":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/2.png");
      datas.material.needsUpdate = true;
      break;
    case "m3":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/3.png");
      datas.material.needsUpdate = true;
      break;
    case "m4":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/4.png");
      datas.material.needsUpdate = true;
      break;
    case "m5":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/5.png");
      datas.material.needsUpdate = true;
      break;
    case "m6":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/6.png");
      datas.material.needsUpdate = true;
      break;
    case "m7":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/7.png");
      datas.material.needsUpdate = true;
      break;
    case "m8":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/8.png");
      datas.material.needsUpdate = true;
      break;
    case "m9":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/9.png");
      datas.material.needsUpdate = true;
      break;
    case "m10":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/10.png");
      datas.material.needsUpdate = true;
      break;
    case "m11":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/11.png");
      datas.material.needsUpdate = true;
      break;
    case "m12":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/12.png");
      datas.material.needsUpdate = true;
      break;
    case "m13":
      datas.material.map = THREE.ImageUtils.loadTexture("earth/13.png");
      datas.material.needsUpdate = true;
      break;
    default:
      console.log("error");
  }
}

// 默认动画
function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.001;
  datas.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

// 开始
init();
animate();