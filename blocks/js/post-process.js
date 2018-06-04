
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



    /*effectRGB = new THREE.ShaderPass(THREE.RGBShiftShader);
    effectRGB.uniforms['amount'].value = effectController.effectRGB;
    effectRGB.renderToScreen = true;*/


    //var outputPass = new THREE.ShaderPass(THREE.CopyShader)
    //outputPass.renderToScreen = true
    //composer.addPass(outputPass);
    //composer.addPass(effectRGB);






}


