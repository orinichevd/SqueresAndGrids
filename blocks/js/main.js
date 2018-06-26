

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

var tweenBoom = [];
var tweenBack = [];

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

    var matChanger = function () {

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
        for (var i = 0; i < cubes.length; i++) {
            cubes[i].material.opacity = effectController.cubeOpacity;
        }

    };

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
    createTweenBoom();
    createTweenBack();
    createHide();
    createShow();
    for (var i = 0; i < tweenBoom.length; i++) {
        tweenBoom[i].chain(tweenBack[i]);
    }
    for (var i = 0; i < tweenBoom.length; i++) {
        tweenBack[i].start();
    }
}



function recomposeBlock(cube) {
    for (var i = 0; i < maxRemoveCount; i++) {
        var prey = Math.floor(Math.random() * ccount);
        cube.children[prey].visible = !cube.children[prey].visible;
    }
    if (maxRemoveCount < 200) {
        maxRemoveCount++;
    }

}



function createTweenBack() {
    for (var i = 0; i < clength / csize; i++) {
        for (var j = 0; j < cwidth / csize; j++) {
            for (var k = 0; k < cheight / csize; k++) {
                var cube = cubes.children[i + j * (clength / csize) + k * (clength / csize) * (cwidth / csize)]
                tweenBack.push(new TWEEN.Tween(cube.position).to({
                    x: -clength / 2 + i * csize,
                    y: -cwidth / 2 + j * csize,
                    z: -cheight / 2 + k * csize
                }, 1000)
                    .easing(TWEEN.Easing.Cubic.InOut));
            }
        }
    }
}


function createTweenBoom() {
    for (var i = 0; i < ccount; i++) {
        var cube = cubes.children[i];
        tweenBoom.push(new TWEEN.Tween(cube.position).to({
            x: cube.position.x + Math.random() * 400 - 200,
            y: cube.position.y + Math.random() * 400 - 200,
            z: cube.position.z + Math.random() * 400 - 200
        }, 5000)
            .easing(TWEEN.Easing.Cubic.InOut));
    }
}

function createHide() {
    for (var i = 0; i < ccount; i++) {
        var cube = cubes.children[i];
        tweenHide.push(new TWEEN.Tween(cube.material).to({ opacity: 0 }, 1500)
            .easing(TWEEN.Easing.Cubic.InOut));
    }
    tweenFogMore = new TWEEN.Tween(scene.fog).to({ density: 0.003 }, 1500);
}

function createShow() {
    for (var i = 0; i < ccount; i++) {
        var cube = cubes.children[i];
        tweenShow.push(new TWEEN.Tween(cube.material).to({ opacity: cubeOpacity }, 1500)
            .easing(TWEEN.Easing.Cubic.InOut));
    }
    tweenFogLess = new TWEEN.Tween(scene.fog).to({ density: 0.001 }, 1500);
}

function hideCube() {
    for (var i = 0; i < tweenHide.length; i++) {
        tweenHide[i].start();
    }
    tweenFogMore.start();
    glitchEnabled = false;
    helper.visible = false;
}

function showCube() {
    for (var i = 0; i < tweenShow.length; i++) {
        tweenShow[i].start();
    }
    tweenFogLess.start();
    glitchEnabled = true;
    helper.visible = true;
}

function animate() {
    if (!animation) return;
    requestAnimationFrame(animate);
    recomposeBlock(cubes);
    var luck = Math.random();

    if (luck < 0.003) {
        for (var i = 0; i < tweenBoom.length; i++) {
            tweenBoom[i].start();
        }
        effectGlitch.enabled = !effectGlitch.enabled && glitchEnabled;
    }

    cubes.rotation.x = cubes.rotation.x + 0.01;
    cubes.rotation.z = cubes.rotation.z + 0.01;

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

function dist(x1, y1, x2, y2, z1, z2) {
    if (!x2) x2 = 0;
    if (!y2) y2 = 0;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1));
}

function destroy() {
    animation = false;
    var myNode = document.getElementById('container');
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    delete gui;
    delete stats;
    delete tweenBoom;
    delete tweenBack;

    delete tweenHide;
    delete tweenFogMore;
    delete tweenShow;
    delete tweenFogLess;

    delete materials;
    delete parameters;
    delete particles;
    delete cubes;
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
