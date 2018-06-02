'use strict'

var maxTicksAfterExplosion = 40;

var animation = true;

var expolesed = false;
var ticksAfterExplosion;
var expolosionTime;

var effectController = {
    effectRGB: 0.00000,
    camFOV: true,

};

init();
animate();

function init() {

    initScene();

    initObjects();

    initLights();

    postProcess();
}

var maxRemoveCount = -1000;

function recomposeBlock(cube) {
    for (var i = 0; i < maxRemoveCount; i++) {
        var prey = Math.floor(Math.random() * ccount);
        cube.children[prey].visible = !cube.children[prey].visible;
    }
    if (maxRemoveCount < 300) {
        maxRemoveCount++;
    }
    
}

function booom() {
    effectGlitch.enabled = true;
    for (var i = 0; i < ccount; i++) {
        var cube = cubes.children[i];
        cube.position.x = cube.position.x + Math.random() * 200 - 100;
        cube.position.y = cube.position.y + Math.random() * 200 - 100;
        cube.position.z = cube.position.z + Math.random() * 200 - 100;
    }
    expolesed = true;
    ticksAfterExplosion = 0;
}

function restore() {
    effectGlitch.enabled = false;
    for (var i = 0; i < clength / csize; i++) {
        for (var j = 0; j < cwidth / csize; j++) {
            for (var k = 0; k < cheight / csize; k++) {
                var cube = cubes.children[i + j * (clength / csize) + k * (clength / csize) * (cwidth / csize)]
                cube.position.x = -clength / 2 + i * csize;
                cube.position.y = -cwidth / 2 + j * csize;
                cube.position.z = -cheight / 2 + k * csize;
            }
        }
    }
    expolesed = false;
}

function animate() {

    requestAnimationFrame(animate);
    recomposeBlock(cubes);
    var luck = Math.random();
    if (expolesed) {
        ticksAfterExplosion++;
    }
    if (expolesed && ticksAfterExplosion >= maxTicksAfterExplosion) {
        restore();
    }
    if (luck < 0.003 && !expolesed) {
        booom()
    }

    cubes.rotation.x = cubes.rotation.x + 0.01;
    cubes.rotation.z = cubes.rotation.z + 0.01;

    
    if (camera.position.z > 410) {
        camera.position.z -= 10 * 0.05;
        camera.position.x -= 10 * 0.05;
    } else {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;

        camera.position.z = 410;
  
    }

    camera.lookAt(scene.position);

    composer.render(scene, camera);

}
