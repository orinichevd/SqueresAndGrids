'use strict'

var effectController = {

    focus: 350.0,
    aperture: 0,
    maxblur: 0.003,

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
    }

};

var animation = true;
var stats;

var ticksAfterExplosion;
var expolosionTime;

var tweenBoom = [];
var tweenBack = [];

var helper;

init();
animate();

function init() {

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
        var gui = new dat.GUI();
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
        stats = new Stats();
        document.getElementById( 'otez' ).appendChild(stats.domElement);
    }

    matChanger();
    createTweenBoom();
    createTweenBack();
    for (var i = 0; i < tweenBoom.length; i++) {
        tweenBoom[i].chain(tweenBack[i]);
    }
    for (var i = 0; i < tweenBoom.length; i++) {
        tweenBack[i].start();
    }
}

var maxRemoveCount = -500;

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

function animate() {

    requestAnimationFrame(animate);
    recomposeBlock(cubes);
    var luck = Math.random();

    if (luck < 0.003) {
        for (var i = 0; i < tweenBoom.length; i++) {
            tweenBoom[i].start();
        }
        effectGlitch.enabled = !effectGlitch.enabled;
    }

    cubes.rotation.x = cubes.rotation.x + 0.01;
    cubes.rotation.z = cubes.rotation.z + 0.01;

    if (camera.position.z > 410) {
        camera.position.z -= 20;
        camera.position.y += 10*0.09;
    } else {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;

        camera.position.z = 400;

    }
    TWEEN.update();
    camera.lookAt(scene.position);
    composer.render(scene, camera);
    if (debug) stats.update();

}

function dist(x1,y1,x2,y2,z1,z2){ 
    if(!x2) x2=0; 
    if(!y2) y2=0;
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)+(z2-z1)*(z2-z1)); 
  }
