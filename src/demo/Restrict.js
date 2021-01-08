import {inside} from "./point-in-polygon/index.js"
import {Environment } from "./Environment.js"


const Levels = {
	1: Environment.initialPos, 
	2: {x: 8, y:10, z:13},
	3: {x: -36, y:10, z:13},
	4: {x: -21, y:17, z:-10},
	5: {x:0, y:23, z:-4},
	6: {x: -36, y:23, z:-10},
}

const Limits = {
	1:[
		[ -6.5, -11.421604429985326],
		[-6.5, -8.59],
		[-5.5, -8.59],
		[-5.5, -2],
		[-6.5, -2],
		[-6.5, 1.77],
		[-5.5, 1.77],
		[-5.5, 8],
		[-5.5, 8],
		[-6.5, 8],

		[ -6.5, 12.5],
		[ 5.812735604133743,  12.5],
		[ 5.81, 15],
		[ -28.71, 15],
	//	[ 5.81, 31],
	//	[ -28.71, 31],
		[ -28.71, 12.3],
		[ -27.71, 12.3],
		[ -27.71, 0.6],
		[ -10, 0.6],
		[ -10, -11.421604429985326],
	],
	2: [
		[14.16,12.89],
		[6.49,12.89],
		[6.49, 32.8],
		[14.16, 32.8]
	],
	3: [
		[-37,12.49],
		[-37, 32.3],
		[-29.7, 32.3],
		[-29.7, 12.49],
	],
	4:[
		[-28.3, 0.6],
		[-11, 0.6],
		[-11, -11.6],
		[-28.3, -11.6],
	],
	5:[
		[5.3, -11.7],
		[-5.3, -11.7],
		[-5.3, 12.64],
		[-28.75, 12.64],
		[-28.75, -11.7],
		[-37, -11.7],
		[-37, 14.7],
		[14.1, 14.7],
		[14.1, 12.2],
		[5.24, 12.2],
		[5.3, 12.2],
	],
	6:[
		[5.3, -11.7],
		[-5.3, -11.7],
		[-5.3, 12.64],
		[-28.75, 12.64],
		[-28.75, -11.7],
		[-37, -11.7],
		[-37, 14.7],
		[14.1, 14.7],
		[14.1, 12.2],
		[5.24, 12.2],
		[5.3, 12.2],
	]
}

const Doors = {
	1: {
		3:[
			[-5,-3.10],
			[-5,-2.0],
			[-7.59,-2.0],
			[-7.59,-3.1],
		],
		5:[
			[-5,3.61],
			[-7.59,3.61],
			[-7.59,1.61],
			[-5,1.61],
		],
		2:[
			[-5, 7.9],
			[-5, 4.1],
			[-7.9, 4.1],
			[-7.9, 7.9],
		],


		6:[
			[-10.91, -11.2],
			[-10.91, -6.9],
			[-7.91, -6.9],
			[-7.91, -11.2],
		],
		4: [
			[-10.91, -5],
			[-10.91, 0],
			[-7.91, 0],
			[-7.91, -5],
		],
	},	
	2: {
		1: [
			[11,12.8],
			[6.49,12.8],
			[6.49,13.8],
			[11,13.8],
		],
	},
	3:{ 
		1:[
			[-37.9, 12.5],
			[-37.9, 15.3],
			[-35.9, 15.3],
			[-35.9, 12.5],
		],
	},
	4:{
		1: [
			[-22.5, -11.3],
			[-22.5, -8.3],
			[-20.5, -8.3],
			[-20.5, -11.3],
		],
	},
	5:{
		2:[
			[0, -3.3],
			[2,-3.3],
			[2,-5.3],
			[0,-5.3],
		],
		4:[
			[-37, -11.4],
			[-37, -8.5],
			[-34.5, -8.5],
			[-34.5, -11.4],

		]
	},
	6:{
		2:[
			[0, -3.3],
			[2,-3.3],
			[2,-5.3],
			[0,-5.3],
		],
		4:[
			[-37, -11.4],
			[-37, -8.5],
			[-34.5, -8.5],
			[-34.5, -11.4],

		]
	}
}


export const addLevels = function(Scene){
/*
	window.addEventListener("changeUser", function (event) {
	    const uuid = event.detail.uuid;
	    let prop = event.detail.prop;
	    let value = event.detail.value;
	    if (uuid == "me" && prop == "level" && Levels.hasOwnProperty(value) ){
		    console.debug("going to level",value)
		    let pos = Levels[value]
		    Scene.camera.position.set(pos.x, pos.y, pos.z)
	    }
	    if (uuid == "01800-api-666" && prop == "fuentelvl"){
		    Limits[1][12][1] = 32
		    Limits[1][13][1] = 32
	    }
	});
	
	window.addEventListener("addUser", function (event) {
	    const uuid = event.detail.uuid;
	    if (uuid == "01800-api-666" && Users["01800-api-666"].fuentelvl !=0){
		    Limits[1][12][1] = 31
		    Limits[1][13][1] = 31
	    }
	});
	window.addEventListener("keydown", function(event){
		let key = event.key
		let lvl = Users.me.level
		let pos = Scene.camera.position
		if(key=="Enter" || key=="x" || key=="X"){
			//teleport
			for (let [k, v] of Object.entries(Doors[lvl])) {
				let res = inside([pos.x, pos.z], v)
				if(res){
					Users.me.level = k
					break
				}
			}
		}
	})

	window.addEventListener("dblclick", function(event){
		let lvl = Users.me.level
		let pos = Scene.camera.position
		//teleport
		for (let [k, v] of Object.entries(Doors[lvl])) {
			let res = inside([pos.x, pos.z], v)
			if(res){
				Users.me.level = k
				break
			}
		}
	})
	
	let timeout;
	let lastTap = 0;
	window.addEventListener('touchend', function(event) {
		if(document.querySelector(".chat-body").classList.contains("show")) return
		let currentTime = new Date().getTime();
		let tapLength = currentTime - lastTap;
		clearTimeout(timeout);
		if (tapLength < 500 && tapLength > 0) {

			let lvl = Users.me.level
			let pos = Scene.camera.position
			//teleport
			for (let [k, v] of Object.entries(Doors[lvl])) {
				let res = inside([pos.x, pos.z], v)
				if(res){
					Users.me.level = k
					break
				}
			}

			event.preventDefault();
		} else {
			timeout = setTimeout(function() {
				clearTimeout(timeout);
			}, 500);
		}
		lastTap = currentTime;
	});
*/
}

export const restrict = function(p){
	let res = true
	//let lvl = Users.me.level
	//res = inside([p[0], p[2]], Limits[lvl])
	
	return res
}


export const teleport = function(){


}

window.inside = inside
window.limits = Limits
