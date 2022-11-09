// import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
// import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.125.0/examples/jsm/controls/OrbitControls.js";
import data135_1970 from "https://pudding.nousbuild.com/earth3d-radiation-threejs/earth3d-demo4/data/1970.js";
import data135_1971 from "https://pudding.nousbuild.com/earth3d-radiation-threejs/earth3d-demo4/data/1971.js";
import data135_1972 from "https://pudding.nousbuild.com/earth3d-radiation-threejs/earth3d-demo4/data/1972.js";

// 全局变量
var camera, scene, renderer, controls;
var earth, cloud, datas, barMesh;
var pointLight, ambientLight;
var scene = new THREE.Scene();
var step = 0;

const globeRadius = 31; // 球体半径

const colors = [
    "#d7df23",
    "#9fce66",
    "#edb113",
    "#0c9a39",
    "#15adff",
    "#3e66a3",
    "#9966cc",
    "#7f3f98",
];

const domain = [
    0,
    100000,
    200000,
    300000,
    400000,
    500000,
    600000,
    700000,
];

const m1Btn = document.querySelector(".m1");
const m2Btn = document.querySelector(".m2");
m1Btn.onclick = () => startMovie("m1");
m2Btn.onclick = () => startRemove("m2");

// 开始
init();
animate();

function init() {
    // 初始化 Three.js
    // scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-20, 40, -72);

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
    var datas_texture = new THREE.TextureLoader().load('earth/1970.png');
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

    // 柱状图
    createBar(data135_1970);

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
    controls.minDistance = 40;
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

// 开始动画
function startMovie() {
    document.getElementById("month-select").style.display = 'none';
    var year = 1970;
    setInterval(function () {
        document.getElementById("msg-left").innerHTML = year + ' 年';

        datas.material.map = THREE.ImageUtils.loadTexture("earth/" + year + ".png");
        datas.material.needsUpdate = true;

        if (year >= 1972) {
            if (year == 1972) { createBar(data135_1972); }
            year = 1970
        } else {
            removeBar();

            if (year == 1970) { createBar(data135_1970); }
            if (year == 1971) { createBar(data135_1971); }
            if (year == 1972) { createBar(data135_1972); }
            
            year += 1;
        }

    }, 1200);
}

// 逐层拨开
function startRemove() {
    if (!step) {
        scene.remove(cloud);
        step += 1;
    } else if (step == 1) {
        scene.remove(datas);
        step += 1;
    } else if (step == 2) { 
        scene.remove(earth);
        step += 1;
    } else if (step == 3) {
        for (let i = scene.children.length - 1; i >= 0; i--) {
            if(scene.children[i].name === "barMesh")
                scene.remove(scene.children[i]);
        }
        /* 
        scene.traverseVisible(function(child) {
            if (child.type !== 'Scene') {
               scene.remove(child);
            }
        }); 
        */
        step += 1;
    } else {
        scene.add(cloud);
        scene.add(datas);
        scene.add(earth);
        createBar(data135_1970);
        step = 0;
    }
}

// 经纬度转成球体坐标
function convertLatLngToSphereCoords(latitude, longitude, radius) {
    const phi = (latitude * Math.PI) / 180;
    const theta = ((longitude - 180) * Math.PI) / 180;
    const x = -(radius + -1) * Math.cos(phi) * Math.cos(theta);
    const y = (radius + -1) * Math.sin(phi);
    const z = (radius + -1) * Math.cos(phi) * Math.sin(theta);
    return { x, y, z };
}

/**
 * 生成柱状图
 */
function createBar(data) {
    if (!data || data.length === 0) return;

    let color;
    // d3比例尺
    const scale = d3.scaleLinear().domain(domain).range(colors);

    data.forEach(({ lat, lng, value: size }) => {
        // 通过比例尺获取数据对应的颜色
        color = scale(size);
        const pos = convertLatLngToSphereCoords(lat, lng, globeRadius);
        if (pos.x && pos.y && pos.z) {
            // 我们使用立方体来生成柱状图
            const geometry = new THREE.BoxGeometry(0.14, 0.14, 2);
            // 移动立方体Z使其立在地球表面
            geometry.applyMatrix4(
                new THREE.Matrix4().makeTranslation(0, 0, -1)
            );
            barMesh = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({
                    color,
                })
            );
            // 设置一个 Name
            barMesh.name = 'barMesh';
            // 设置位置
            barMesh.position.set(pos.x, pos.y, pos.z);
            // 设置朝向
            barMesh.lookAt(datas.position);
            // 根据数据设置柱的长度, 除 50000 主了为了防止柱体过长，可以根据实际情况调整，或做成参数
            barMesh.scale.z = Math.max(size / 50000, 0.1);
            barMesh.matrixAutoUpdate = true;
            barMesh.updateMatrix();
            // 添加到场景
            scene.add(barMesh);
        }
    });
}

function removeBar() {
    for (let i = scene.children.length - 1; i >= 0; i--) {
        if(scene.children[i].name === "barMesh")
            scene.remove(scene.children[i]);
    }
}
