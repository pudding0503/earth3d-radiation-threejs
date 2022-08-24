import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

var camera, scene, renderer, controls;
var earth, cloud, datas;
var pointLight, ambientLight;
var stats;

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

// 开始
init();
animate();

function init() {
    // 初始化 Three.js
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 200;

    // 帧率 stats
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    stats.domElement.id = "stats";

    // 地球模型
    var earth_texture = new THREE.TextureLoader().load("earth/earth.jpeg");
    var earth_bump = new THREE.TextureLoader().load("earth/bump.jpeg");
    var earth_specular = new THREE.TextureLoader().load("earth/spec.jpeg");
    var earth_geometry = new THREE.SphereGeometry(30, 32, 32);
    var earth_material = new THREE.MeshPhongMaterial({
        shininess: 40,
        bumpScale: 1,
        map: earth_texture,
        bumpMap: earth_bump,
        specularMap: earth_specular
    });
    earth = new THREE.Mesh(earth_geometry, earth_material);
    scene.add(earth);

    // 地球数据（辐射）模型
    var datas_texture = new THREE.TextureLoader().load('earth/1.png');
    var datas_geometry = new THREE.SphereGeometry(30.1, 32, 32);
    var datas_material = new THREE.MeshBasicMaterial({
        shininess: 10,
        map: datas_texture,
        transparent: true,
        opacity: 0.7
    });
    datas = new THREE.Mesh(datas_geometry, datas_material);
    scene.add(datas);

    // 地球云层模型
    var cloud_texture = new THREE.TextureLoader().load('earth/cloud.png');
    var cloud_geometry = new THREE.SphereGeometry(31, 32, 32);
    var cloud_material = new THREE.MeshBasicMaterial({
        shininess: 10,
        map: cloud_texture,
        transparent: true,
        opacity: 0.7
    });
    cloud = new THREE.Mesh(cloud_geometry, cloud_material);
    scene.add(cloud);

    // 灯光效果 (左上角)
    pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(-400, 100, 150);
    scene.add(pointLight);

    // 环境光
    ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    // 渲染设置
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 窗口调整
    window.addEventListener('resize', onWindowResize, false);

    // 滚动设置
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 120;
    controls.maxDistance = 200;
    controls.minZoom = 0.5;
    controls.maxZoom = 2;
    controls.rotateSpeed = 0.4;
}

function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    // 地球的自转速度
    earth.rotation.y += 0.001;
    datas.rotation.y += 0.001;

    // 优化云层移动路径
    cloud.rotation.y += 0.0011 + 0.001 * (Math.random() - 0.12);

    if (cloud.rotation.x < 0.1) {
        cloud.rotation.x += 0.0002;
    }
    else if (cloud.rotation.x > -0.1) {
        cloud.rotation.x -= 0.00012;
    }
    stats.end();
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
