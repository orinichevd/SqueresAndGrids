
'use strict'



var composer;
var effectGlitch;
var effectRGB;
var bokehPass

function postProcess() {

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));

    bokehPass = new THREE.BokehPass( scene, camera, {
        focus: 		410,
        aperture:	1,
        maxblur:	1,

        width: window.innerWidth,
        height: window.innerHeight
    } );
    bokehPass.renderToScreen = true;
    

    
    effectGlitch = new THREE.GlitchPass();
    effectGlitch.enabled = false;


    composer.addPass(effectGlitch);
    composer.addPass(bokehPass);



}


