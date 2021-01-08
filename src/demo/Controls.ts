import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

declare let Users: any;

export interface Controls{
	[name:string] : any
}

export const Controls:Controls = {
	init:  function(Scene){
		this.controls = new PointerLockControls(Scene.camera, document.body);

		if(window.Users && Users.hasOwnProperty('me')){
			Controls.initLockHandler(Scene)

			let pos = Users.me.position
			Scene.camera.position.set(pos.x, pos.y, pos.z)
		}else{
			window.addEventListener("addUser", function (event: CustomEvent) {
		console.debug("holis2", event)

			    if (event.detail.id == Users.me.id) {
				    Controls.initLockHandler(Scene)
				    let pos = Users.me.position
				    Scene.camera.position.set(pos.x, pos.y, pos.z)
			    }

			});
		}
		return this
	},
	initCamerapos: function(Scene){
	},
	initLockHandler: function(Scene){
		console.debug("adding control stuff")
		Controls.controls.addEventListener('lock', function () {
			if (Controls.controls.isLocked) {
			    Users.me.rotation = [
				    Scene.camera.rotation.x,
				    Scene.camera.rotation.y,
				    Scene.camera.rotation.z
			    ]
			    
			}
		});

		(document.querySelector("#scene") as HTMLElement).addEventListener('click', function(){
			Controls.controls.lock()
		
		})
	}
}

/*import { PointerLockControls } from './three/examples/jsm/controls/PointerLockControls.js';
import { DeviceOrientationControls } from "./three/examples/jsm/controls/DeviceOrientationControls.js"
import * as THREE from './three/build/three.module.js';
import { Environment } from "./Environment.js";
import { Users } from "./Users.js";
import {addLevels} from "./Restrict.js"
import {restrict} from "./Restrict.js"

export const Controls = {
    init: function (Scene) {
        let initialPos = Environment.initialPos;
        let initialRot = Environment.initialRot;
        Scene.camera.position.set(initialPos.x, initialPos.y, initialPos.z);
        Scene.camera.rotation.set(initialRot.x, initialRot.y, initialRot.z);

	addLevels(Scene)
        if (detectMob()) {
            this.addDesk(Scene);
	    document.querySelector("#close-info").addEventListener("click",function(){

            Controls.addMobile(Scene);

	    })
        }
        else {
            this.addDesk(Scene);
        }
        return this;
    },
    addDesk: function (Scene) {
        this.controls = new PointerLockControls(Scene.camera, document.body);
        this.rotInterval = null;
        this.direction = new THREE.Vector3();
        this.moveForward = false;
        this.moveBackward = false;
        this.moveRight = false;
        this.moveLeft = false;
        this.vel = 0.1;
        window.addEventListener("addUser", function (event) {
            if (event.detail.uuid == "me" || event.detail.uuid == "01800-api-666") {
                Controls.controls.addEventListener('lock', function () {
                    Controls.rotInterval = window.setInterval(function () {
                        if (Controls.controls.isLocked) {
                            Users.me.rot = {
                                x: Scene.camera.rotation.x,
                                y: Scene.camera.rotation.y,
                                z: Scene.camera.rotation.z,
                            };
                        }
                        else {
                            window.clearInterval(Controls.rotInterval);
                        }
                    }, 400);
                });
            }
        });
        let updatePos = null;
        this.move = function () {
            Controls.direction.z = Number(Controls.moveForward) - Number(Controls.moveBackward);
            Controls.direction.x = Number(Controls.moveRight) - Number(Controls.moveLeft);
	    
		
            if (Controls.direction.z != 0 || Controls.direction.x != 0) {

		    
                Controls.controls.moveForward(Controls.direction.z * Controls.vel);
                Controls.controls.moveRight(Controls.direction.x * Controls.vel);
	    
		//if(!restrict([Users.me.pos.x, Users.me.pos.y, Users.me.pos.z])) {
		if(!restrict([Scene.camera.position.x, Scene.camera.position.y, Scene.camera.position.z])) {
			
			Controls.controls.moveForward(Controls.direction.z * -Controls.vel);
			Controls.controls.moveRight(Controls.direction.x * -Controls.vel);

		}

                if (!updatePos) {
                    updatePos = setInterval(function () {
                        Users.me.pos = {
                            x: Scene.camera.position.x,
                            y: Scene.camera.position.y,
                            z: Scene.camera.position.z,
                        };
                    }, 400);
                }
            }
            else {
                Users.me.pos = {
                    x: Scene.camera.position.x,
                    y: Scene.camera.position.y,
                    z: Scene.camera.position.z,
                };
                if (updatePos)
                    clearInterval(updatePos);
                updatePos = null;
            }
            requestAnimationFrame(Controls.move);
        };
        this.updatePos = function () {
        };
        Controls.controls.addEventListener('unlock', function () {
            window.clearInterval(this.rotInterval);
        });
        let lockfunc = function (e) {
	    if(!detectMob()) {
              Controls.controls.lock();
	    }
        };
        document.querySelector("canvas").addEventListener("click", lockfunc, false);
        document.querySelectorAll(".blank").forEach(function (e) {
            e.addEventListener("click", lockfunc, false);
        });
        window.addEventListener("addUser", function (event) {
            let uuid = event.detail.uuid;
            if (uuid == "me")
                requestAnimationFrame(Controls.move);
        });
        window.addEventListener("moveUser", function (event) {
            let uuid = event.detail.uuid;
            let pos = event.detail.pos;
            if (uuid == "me")
                Scene.camera.position.set(pos.x, pos.y, pos.z);
        });
        window.addEventListener("keydown", function (event) {
            if (Controls.controls.isLocked == false)
                return;
            if (document.activeElement != document.body)
                return;
            switch (event.key) {
                case "w":
                case "W":
                    Controls.moveForward = true;
                    break;
                case "s":
                case "S":
                    Controls.moveBackward = true;
                    break;
                case "a":
                case "A":
                    Controls.moveLeft = true;
                    break;
                case "d":
                case "D":
                    Controls.moveRight = true;
                    break;
            }
        });
        window.addEventListener("keyup", function (event) {
            switch (event.key) {
                case "w":
                case "W":
                    Controls.moveForward = false;
                    break;
                case "s":
                case "S":
                    Controls.moveBackward = false;
                    break;
                case "a":
                case "A":
                    Controls.moveLeft = false;
                    break;
                case "d":
                case "D":
                    Controls.moveRight = false;
                    break;
            }
        });

	document.querySelector("#velocidad").addEventListener("change", function(evt){
		let value = (1 + parseFloat(evt.target.value)) / 100
		Controls.vel  = value
	})
    },
    addMobile: function (Scene) {
	    let controls = new DeviceOrientationControls(Scene.camera)

	    window.addEventListener("touchstart",function(){
		    if(document.querySelector(".chat-body").classList.contains("show")) return
		    Controls.moveForward = true
	    })
	    
	    window.addEventListener("touchcancel",function(){
		    Controls.moveForward = false
	    })
	    
	    window.addEventListener("touchend",function(){
		    Controls.moveForward = false
	    })


	document.querySelector("#velocidad").addEventListener("change", function(evt){
		let value = (1 + parseFloat(evt.target.value)) / 100
		Controls.vel  = value
	})

	    function update(){
		requestAnimationFrame(update)
		controls.update();
		}
	update()
    }
};
function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}
*/
