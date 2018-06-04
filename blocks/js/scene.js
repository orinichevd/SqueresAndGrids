
'use strict'
var camera, scene, renderer, light, lightLeft;

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
    camera.position.z = 300;
    camera.position.y = 6000;
    camera.position.x = 6000;

    // Scene

    scene = new THREE.Scene();
    scene.background = 0xFFFFFF;


    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('resize', onWindowResize, false);

}

var spotLight1 = createSpotlight( 0x6AE2F7,0,150,0, Math.PI/3 );
			var spotLight2 = createSpotlight( 0xF90387, 0, -390, 0, -Math.PI/3 );
			var spotLight3 = createSpotlight( 0x7F00FF );

function initLights() {
    var lightHelper1 = new THREE.SpotLightHelper( spotLight1 );
    var lightHelper2 = new THREE.SpotLightHelper( spotLight2 );
    var lightHelper3 = new THREE.SpotLightHelper( spotLight3 );
    scene.add( spotLight1, spotLight2);//, spotLight3 );
	//scene.add( lightHelper1, lightHelper2);//, lightHelper3 );

    scene.add(new THREE.AmbientLight(0x222222));


    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(200, 200, 200);
    //scene.add(light);

    lightLeft = new THREE.DirectionalLight(0xFFFFFF);
    lightLeft.position.set(0, -140, 0);
    //scene.add(lightLeft);

    //scene.fog = new THREE.FogExp2( 0x555555, 0.0020 );

}

function createSpotlight( color, x, y, z , angle ) {
    var newObj = new THREE.SpotLight( color, 2 );
    newObj.castShadow = false;
    newObj.position.y = y;
    newObj.angle = angle;
    newObj.angle = 0.6;
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

function onMouseUp(event) {
    restore();
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
