import * as THREE from "THREE";
//import  {GLTFLoader} from "./three/examples/jsm/loaders/GLTFLoader.js"
//import  {DRACOLoader} from "./three/examples/jsm/loaders/DRACOLoader.js"

import { addFloor } from "./Scene/Floor";
import { Controls } from "./Controls";
import { Avatar } from "./Scene/Avatar";
/*
import { addSkyBox } from "./Scene/Sky.js";

import { addZordon } from "./Scene/Zordon.js";
import { addCiudad } from "./Scene/Ciudad.js";
import { addScreens } from "./Scene/Screens.js"
import { addSnow } from "./Scene/snow.js"
import { addVilla } from "./Scene/villa.js"
//import { addAliens } from "./Scene/aliens.js"
import { addCarrusel } from "./Scene/carrusel.js"
import { addEsferas } from "./Scene/esferas.js"
import { addPine } from "./Scene/pine.js"
import { addPortal } from "./Scene/portal.js"
import { addAngels } from "./Scene/angels.js"
*/

declare global{
	interface Window { 
		Scene: any
		THREE: any
	}
}

export interface Scene {
	scene: THREE.Scene
	camera: THREE.PerspectiveCamera
	renderer: THREE.WebGLRenderer
	[name: string] : any

}

export const Scene : Scene= {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000),
    renderer: new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance"}),
  //  loader: new GLTFLoader(),
//    dracoLoader: new DRACOLoader(),
    ambientLight: new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 ),
    pointLight: new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 ),
//	new THREE.SpotLight(0x61647C),
    init: function () {
        this.renderer.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75);
        (document.querySelector("#scene") as HTMLElement).appendChild(this.renderer.domElement);
	/*
	this.dracoLoader.setDecoderPath( '/js/three/examples/js/libs/draco/' );
	this.loader.setDRACOLoader( this.dracoLoader );
	*/
	this.renderer.shadowMap.enabled = true;
	this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

	this.renderer.outputEncoding = THREE.GammaEncoding
	this.renderer.toneMappingExposure = 80
	this.renderer.gammaFactor = 0.02
	
	this.scene.add( this.ambientLight );
	this.scene.add( this.pointLight );
	
	
	this.pointLight.position.set(-20, 27, 14)



	this.renderer.toneMapping = THREE.ReinhardToneMapping;


        this.floor = addFloor(this)
        this.controls = Controls.init(this);
        this.avatar = Avatar.init(this);
	/*

	this.sky = addSkyBox(this)
        this.ciudad = addCiudad(this)
        this.zordon = addZordon(this)
	    this.snow = addSnow(this)
	addScreens(this)
	addVilla(this)
//	addAliens(this)
	addCarrusel(this)
	addEsferas(this) 
	addPine(this)
	addPortal(this)

	addAngels(this)
       */
        this.animate();
    },
    audioListener: {},
    salas: {},
    
    animate: function () {
        window.requestAnimationFrame(Scene.animate);
        Scene.renderer.render(Scene.scene, Scene.camera);
    }
};

window.addEventListener('resize', function onWindowResize() {
    Scene.camera.aspect = window.innerWidth / window.innerHeight;
    Scene.camera.updateProjectionMatrix();
    Scene.renderer.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75);
}, false);

/*
document.querySelectorAll(".quality").forEach(function (qual_item) {
    qual_item.addEventListener("click", function (event) {
        let selection = event.target;
        let quality = parseFloat(selection.getAttribute("quality"));
        document.querySelectorAll(".quality").forEach(function (qual) {
            qual.classList.remove("active");
        });
        selection.classList.add("active");
        Scene.renderer.setPixelRatio(quality);
    });
});
*/
window.Scene = Scene;
window.THREE = THREE;
