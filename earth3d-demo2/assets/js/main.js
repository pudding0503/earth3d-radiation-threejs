var camera, scene, renderer;
var earth, cloud, datas;
var pointLight, ambientLight;
var mouseDown = false, mouseX = 0, mouseY = 0;
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
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 160;
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

    // 渲染
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 鼠标事件处理
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', function (e) { onMouseMove(e); }, false);
    document.addEventListener('mousedown', function (e) { onMouseDown(e); }, false);
    document.addEventListener('mouseup', function (e) { onMouseUp(e); }, false);
    document.addEventListener('mousewheel', function (e) { onDocumentMouseWheel(e); }, false);

    document.addEventListener('touchstart', function (e) { onTouchStart(e); }, false);
    document.addEventListener('touchmove', function (e) { onTouchMove(e); }, false);
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
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(evt) {
    if (!mouseDown) return;
    evt.preventDefault();
    var deltaX = evt.clientX - mouseX, deltaY = evt.clientY - mouseY;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
    rotateScene(deltaX, deltaY);
}

function onTouchStart(evt) {
    evt.preventDefault();
}

function onTouchMove(evt) {
    if (evt.touches.length == 1) {
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
        evt.preventDefault();

        mouseX = + (evt.targetTouches[0].pageX / window.innerWidth) * 2 - 1;
        mouseY = - (evt.targetTouches[0].pageY / window.innerHeight) * 2 + 1;

        var deltaX = 8 * mouseX, deltaY = -6 * mouseY;
        //console.log(deltaX, deltaY)
        rotateScene(deltaX, deltaY);
    }
}

function onMouseDown(evt) {
    evt.preventDefault();
    mouseDown = true;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
}

function onMouseUp(evt) {
    evt.preventDefault();
    mouseDown = false;
}

function onDocumentMouseWheel(event) {
    var fovMAX = 50;
    var fovMIN = 20;
    camera.fov -= event.wheelDeltaY * 0.05;
    camera.fov = Math.max(Math.min(camera.fov, fovMAX), fovMIN);
    camera.projectionMatrix = new THREE.Matrix4().makePerspective(camera.fov, window.innerWidth / window.innerHeight, camera.near, camera.far);
}

function rotateScene(deltaX, deltaY) {
    earth.rotation.y += deltaX / 300;
    earth.rotation.x += deltaY / 300;
    datas.rotation.y += deltaX / 300;
    datas.rotation.x += deltaY / 300;
    cloud.rotation.y += deltaX / 300;
    cloud.rotation.x += deltaY / 300;
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
