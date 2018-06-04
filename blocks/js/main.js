'use strict'

var effectController  = {

    focus: 		410.0,
    aperture:	0.5,
    maxblur:	0.2

};

var maxTicksAfterExplosion = 40;

var animation = true;

var expolesed = false;
var ticksAfterExplosion;
var expolosionTime;


var helper;

init();
animate();

function init() {

    

    initScene();
   

    initObjects();

    initLights();

    var helper = new THREE.GridHelper(2000,20,0xFFFFFF, 0xFFFFFF);
    helper.position.y = -300;
    //scene.add(helper);
    
    postProcess();

    var matChanger = function( ) {

        bokehPass.uniforms[ "focus" ].value = effectController.focus;
        bokehPass.uniforms[ "aperture" ].value = effectController.aperture * 0.00001;
        bokehPass.uniforms[ "maxblur" ].value = effectController.maxblur;

    };
    /*var gui = new dat.GUI();
    gui.add( effectController, "focus", 10.0, 3000.0, 10 ).onChange( matChanger );
    gui.add( effectController, "aperture", 0, 10, 0.1 ).onChange( matChanger );
    gui.add( effectController, "maxblur", 0.0, 3.0, 0.025 ).onChange( matChanger );
    gui.close();*/
    matChanger();
}

var maxRemoveCount = -1000;

function recomposeBlock(cube) {
    for (var i = 0; i < maxRemoveCount; i++) {
        var prey = Math.floor(Math.random() * ccount);
        cube.children[prey].visible = !cube.children[prey].visible;
    }
    if (maxRemoveCount < 200) {
        maxRemoveCount++;
    }

}

function move() {
    for (var i = 0; i < clength / csize; i++) {
        for (var j = 0; j < cwidth / csize; j++) {
            for (var k = 0; k < cheight / csize; k++) {
                var cube = cubes.children[i + j * (clength / csize) + k * (clength / csize) * (cwidth / csize)]
                if (i < clength / csize / 3) {
                    cube.rotation.x += 0.1;
                } else if (i > 2 * clength / csize / 3) {
                    cube.rotation.x -= 0.1;
                }


            }
        }
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
    //move();
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

        camera.position.z = 400;

    }
    //console.log(camera.position);
    camera.lookAt(scene.position);
    composer.render(scene,camera);

}
