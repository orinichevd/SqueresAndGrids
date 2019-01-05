'use strict'

// particles
var materials = [],
    parameters, i, h, color, size, particles;


// cubes
var clength = 150, cwidth = 150, cheight = 150;
var cubeOpacity = 0.4;
var csize = 12.5;
var ccount = Math.trunc((clength*cwidth*cheight)/(csize*csize*csize));
var meshCubes;


var vertexShaderCode = `
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec4 color;
attribute float opacity;

varying vec4 vColor;
varying vec3 vPosition;
varying float vOpacity;

void main(){
    vPosition = position;
    vColor = color;
    vOpacity = opacity;

    gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
}`

var fragmentShaderCode = `
precision highp float;

        uniform bool dropOpacity;

        varying float vOpacity;
		varying vec3 vPosition;
        varying vec4 vColor;

		void main() {
            vec4 color = vec4( vColor );
            if (!dropOpacity) {
               color.a = vOpacity;
            } else {
                color.a = 0.0;
            }
            
   
			gl_FragColor = color;
		}
`

//grid helper
var helper;


var maxParticleCount = 300;
var particleCount = 150;

// init
function initObjects() {

    initParticles();
    initCube();
    initGrid();

}

function initGrid() {
    helper = new THREE.GridHelper(3000, 20, 0xea38ab, 0xea38ab);
    helper.position.y = -300;
    scene.add(helper);
}


function initCube() {
    var geometriesDrawn = [];
    var matrix = new THREE.Matrix4();
    var quaternion = new THREE.Quaternion(0,0,0);
    for (var i = 0; i < clength / csize; i++) {
        for (var j = 0; j < cwidth / csize; j++) {
            for (var k = 0; k < cheight / csize; k++) {                
                var geometry = new THREE.BoxBufferGeometry();
                var position = new THREE.Vector3();
                position.x = -clength / 2 + i * csize;
                position.y = -cwidth / 2 + j * csize;
                position.z = -cheight / 2 + k * csize;
                var scale = new THREE.Vector3(csize-3, csize-3, csize-3);
                matrix.compose(position, quaternion, scale);
                geometry.applyMatrix(matrix);
                var color = new THREE.Color(0xFFFFFF);
                // give the geometry's vertices a random color, to be displayed
                applyVertexColors(geometry, color);
                createOpacityAttribute(geometry);
                geometriesDrawn.push(geometry);
            }
        }
    }
    let uniforms = THREE.UniformsUtils.merge( [

        THREE.UniformsLib[ "ambient" ],
        THREE.UniformsLib[ "lights" ]
    
    ] );
    uniforms.dropOpacity = { value : false };

    var shaderMaterial = new THREE.RawShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShaderCode,
        fragmentShader: fragmentShaderCode,
        lights: true,
        side: THREE.DoubleSide,
        transparent: true
    } );

    meshCubes = new THREE.Mesh(THREE.BufferGeometryUtils.mergeBufferGeometries(geometriesDrawn), shaderMaterial);
    scene.add(meshCubes);

}


function applyVertexColors( geometry, color ) {
    var position = geometry.attributes.position;
    var colors = [];
    for ( var i = 0; i < position.count; i ++ ) {
        colors.push( color.r, color.g, color.b );   
        colors.push(1.0);
    }
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 4 ) );
}

function createOpacityAttribute(geometry) {
    let transparancy = [];
    var position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
        transparancy.push(0.5);
    }
    geometry.addAttribute('opacity', new THREE.Float32BufferAttribute(transparancy, 1));
}

function initParticles() {

    var geometry = new THREE.Geometry();

    for (i = 0; i < 300; i++) {

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
            color: 0xFFFFFF,//parameters[i][0],
            size: parameters[i][1],
        });

        particles = new THREE.Points(geometry, materials[i]);

        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;



        scene.add(particles);

    }
}