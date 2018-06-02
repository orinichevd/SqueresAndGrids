'use strict'

// particles
var materials = [],
    parameters, i, h, color, size, particles;


// cubes
var clength = 150, cwidth = 150, cheight = 150;
var csize = 10;
var ccount;
var  cubes;
var cubes2;


var maxParticleCount = 300;
var particleCount = 150;
var r = 800;
var rHalf = r / 2;




// init
function initObjects() {

    particles();
    initCube();
    //initGrid();

}

function initGrid() {
    var helper = new THREE.GridHelper(2000, 90, 0xFF0088, 0xFF0088);
    helper.position.x = 1000;
    helper.geometry.rotateZ( Math.PI / 2 );
    scene.add(helper);
}

function initCube() {
    cubes = new THREE.Object3D();

    var material = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        shading: THREE.FlatShading,
        transparent: true,
        opacity: 0.1
    });

    ccount = clength * cwidth * cheight / (csize * csize * csize);
    for (var i = 0; i < clength / csize; i++) {
        for (var j = 0; j < cwidth / csize; j++) {
            for (var k = 0; k < cheight / csize; k++) {
                var cube = new THREE.Mesh(new THREE.BoxGeometry(csize - Math.random() * 4, csize - Math.random() * 4, csize - Math.random() * 4), material);
                cube.position.x = -clength / 2 + i * csize;
                cube.position.y = -cwidth / 2 + j * csize;
                cube.position.z = -cheight / 2 + k * csize;

                cubes.add(cube);
            }
        }
    }
    cubes.position.y = -140;
    //cubes.position.x = 300;
    scene.add(cubes);


}

function particles() {

    var geometry = new THREE.Geometry();

    for (i = 0; i < 500; i++) {

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2000 - 1000;
        vertex.y = Math.random() * 2000 - 1000;
        vertex.z = Math.random() * 2000 - 1000;

        geometry.vertices.push(vertex);

    }

    parameters = [
        [
            0x6AE2F7, 2
        ],
        [
            0x8DACDC, 2
        ],
        [
            0xA38ACB, 2
        ],
        [
            0xCE45A8, 2
        ],
        [
            0xF90387, 2
        ]
    ];

    for (i = 0; i < parameters.length; i++) {

        materials[i] = new THREE.PointsMaterial({
            color: 0xAAAAAA,//parameters[i][0],
            size: parameters[i][1]
        });

        particles = new THREE.Points(geometry, materials[i]);

        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;



        scene.add(particles);

    }
}