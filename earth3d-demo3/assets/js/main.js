import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

var camera, scene, renderer, controls;
var earth, cloud, datas;
var pointLight, ambientLight;

const m1Btn = document.querySelector(".m1");
m1Btn.onclick = () => startMovie("m1");

// 开始
init();
animate();

function init() {
    // 初始化 Three.js
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-10, 20, -36);

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
    var datas_texture = new THREE.TextureLoader().load('earth/2016-1.png');
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

    // 灯光效果
    pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(-200, 300, -200);
    pointLight.intensity = 1.2;
    scene.add(pointLight);

    // 环境光
    ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    // 渲染设置
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = "earth";
    document.body.appendChild(renderer.domElement);

    // 窗口调整
    window.addEventListener('resize', onWindowResize, false);

    // 滚动设置
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 110;
    controls.maxDistance = 200;
    controls.minZoom = 0.5;
    controls.maxZoom = 2;
    controls.rotateSpeed = 0.8;
}

function animate() {
    requestAnimationFrame(animate);

    // 地球的自转速度
    //earth.rotation.y += 0.001;
    //datas.rotation.y += 0.001;

    // 优化云层移动路径
    cloud.rotation.y += 0.0002 + 0.001 * (Math.random() - 0.08);

    if (cloud.rotation.x < 0.1) {
        cloud.rotation.x += 0.0002;
    }
    else if (cloud.rotation.x > -0.1) {
        cloud.rotation.x -= 0.00012;
    }

    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function startMovie() {
    document.getElementById("month-select").style.display = 'none';
    var month = 1;
    var year = 2016;
    setInterval(function () {
        console.log(month);
        document.getElementById("msg-left").innerHTML = year + ' 年';
        document.getElementById("msg-right").innerHTML = month + ' 月';

        datas.material.map = THREE.ImageUtils.loadTexture("earth/" + year + "-" + month + ".png");
        datas.material.needsUpdate = true;

        if (month >= 12) {
            month = 1; year += 1;
            if (year > 2017) { year = 2016 }
        }
        else {
            month += 1;
        }
    }, 600);
}