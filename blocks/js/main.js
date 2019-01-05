

var effectController = {

    focus: 0,
    aperture: 0,
    maxblur: 0,

    gridEnabled: true,

    fogEnabled: true,
    fogColor: 0x222222,
    fogIntencity: 0.001,

    coloredLightsEnabled: true,
    directLightsEnabled: false,

    explode: function () {
        for (var i = 0; i < tweenBoom.length; i++) {
            tweenBoom[i].start();
        }
    },

    hide: function () {
        hideCube();
    },

    show: function () {
        showCube();
    }

};

var animation = true;


var ticksAfterExplosion;
var expolosionTime;

var tweenHide = [];
var tweenFogMore;
var tweenShow = [];
var tweenFogLess;

var glitchEnabled = true;
var maxRemoveCount = -500;

var gui;
var stats;

init();
animate();

function init() {

    animation = true;

    initScene();

    initObjects();

    initLights();

    postProcess();

    if (debug) {
        gui = new dat.GUI();
        gui.add(effectController, "focus", 10.0, 3000.0, 10).onChange(matChanger);
        gui.add(effectController, "aperture", 0, 10, 0.1).onChange(matChanger);
        gui.add(effectController, "maxblur", 0.0, 1.0, 0.0001).onChange(matChanger);
        gui.add(effectController, "gridEnabled", ).onChange(matChanger);
        gui.add(effectController, "fogEnabled", ).onChange(matChanger);
        gui.addColor(effectController, "fogColor", ).onChange(matChanger);
        gui.add(effectController, "fogIntencity", 0.0, 0.5, 0.00001).onChange(matChanger);
        gui.add(effectController, "coloredLightsEnabled").onChange(matChanger);
        gui.add(effectController, "directLightsEnabled").onChange(matChanger);
        gui.add(effectController, "explode");
        gui.add(effectController, "hide");
        gui.add(effectController, "show");
        stats = new Stats();
        document.getElementById('otez').appendChild(stats.domElement);
    }

    matChanger();
    createHide();
    createShow();
}

function matChanger () {

    bokehPass.uniforms["focus"].value = effectController.focus;
    bokehPass.uniforms["aperture"].value = effectController.aperture * 0.00001;
    bokehPass.uniforms["maxblur"].value = effectController.maxblur;
    helper.visible = effectController.gridEnabled;
    if (effectController.fogEnabled) {
        scene.fog = new THREE.FogExp2(effectController.fogColor, effectController.fogIntencity);
    } else {
        scene.fog = null;
    }
    light1.visible = effectController.directLightsEnabled;
    light2.visible = effectController.directLightsEnabled;
    spotLight1.visible = effectController.coloredLightsEnabled;
    spotLight2.visible = effectController.coloredLightsEnabled;
    spotLight3.visible = effectController.coloredLightsEnabled;
    spotLight4.visible = effectController.coloredLightsEnabled;

};

function createHide() {
    tweenFogMore = new TWEEN.Tween(scene.fog).to({ density: 0.003 }, 1500);
}

function createShow() {
    tweenFogLess = new TWEEN.Tween(scene.fog).to({ density: 0.001 }, 1500);
}

function hideCube() {
    meshCubes.material.uniforms.dropOpacity.value = true;
    tweenFogMore.start();
    glitchEnabled = false;
    helper.visible = false;
}


function showCube() {
    meshCubes.material.uniforms.dropOpacity.value = false;
    tweenFogLess.start();
    glitchEnabled = true;
    helper.visible = true;
}

function animate() {
    if (!animation) return;
    requestAnimationFrame(animate);

    var luck = Math.random();

    if (luck < 0.003) {
        effectGlitch.enabled = !effectGlitch.enabled && glitchEnabled;
    }

    meshCubes.rotation.x = meshCubes.rotation.x + 0.01;
    meshCubes.rotation.z = meshCubes.rotation.z + 0.01;


    cubesBlink();

    if (camera.position.z > 410) {
        camera.position.z -= 20;
        camera.position.y += 10 * 0.09;
    } else {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;

        camera.position.z = 400;

    }
    TWEEN.update();
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    //composer.render(scene, camera);
    if (debug) stats.update();

}

function cubesBlink() {
    let geometry = meshCubes.geometry;
    let attribute = geometry.getAttribute('opacity');
    for (let i=0; i<maxRemoveCount; i++) {
        
        let target = Math.trunc(Math.random()*ccount)*24;
        for (let k=target; k<target+24; k++) {
            let opacity = attribute.array[k] <= 0.2 ? 0.5 : 0.1;
            attribute.array[k] = opacity;
        }

    }
    attribute.needsUpdate = true;
    if (maxRemoveCount < 200) {
        maxRemoveCount++;
    }
}

function destroy() {
    animation = false;
    var myNode = document.getElementById('container');
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    delete gui;
    delete stats;

    delete tweenHide;
    delete tweenFogMore;
    delete tweenShow;
    delete tweenFogLess;

    delete materials;
    delete parameters;
    delete particles;
    delete helper;

    delete camera;
    delete scene;
    delete renderer;
    delete light1;
    delete light2;

    delete composer;
    delete effectGlitch;
    delete effectRGB;
    delete bokehPass;
}
