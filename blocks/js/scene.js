
'use strict'
var camera, scene, renderer, light1, light2;


var spotLight1 = createSpotlight(0x6AE2F7, -50, 150, 0, Math.PI / 3);
var spotLight2 = createSpotlight(0xF90387, -50, -390, 0, -Math.PI / 3);
var spotLight3 = createSpotlight(0x6AE2F7, 50, 150, 0, Math.PI / 3);
var spotLight4 = createSpotlight(0xF90387, 50, -390, 0, -Math.PI / 3);

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function initScene() {

    if (!Detector.webgl) Detector.addGetWebGLMessage();
    renderer = new THREE.WebGLRenderer();


    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);


    // Camera

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 2500;
    camera.position.y = -200;
    camera.position.x = 0;

    // Scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x141414 );

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    window.addEventListener('resize', onWindowResize, false);

}

function initLights() {
    scene.add(spotLight1, spotLight2, spotLight3, spotLight4);

    scene.add(new THREE.AmbientLight(0x999999));

    light1 = new THREE.DirectionalLight(0xffffff);
    light1.position.set(200, 200, 200);
    scene.add(light1);

    light2 = new THREE.DirectionalLight(0xFFFFFF);
    light2.position.set(0, -140, 0);
    scene.add(light2);

    scene.fog = new THREE.FogExp2(effectController.fogColor, effectController.fogIntencity);

}

function createSpotlight(color, x, y, z, angle) {
    var newObj = new THREE.SpotLight(color, 2);
    newObj.castShadow = false;
    newObj.position.y = y;
    newObj.angle = angle;
    newObj.penumbra = 0;
    newObj.intencity = 2;
    newObj.decay = 2;
    newObj.distance = 500;
    newObj.shadow.mapSize.width = 1024;
    newObj.shadow.mapSize.height = 1024;
    return newObj;
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart(event) {

    if (event.touches.length === 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length === 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

    }

}
