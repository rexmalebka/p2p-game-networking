import * as THREE from 'three'
const room = "default"
const uuid = Math.random().toString(16).substr(2)

export const config = {
	id: `${room}-${uuid}`,
	room: room
}

export const initials = {
	nickname_pre: "player",
	position: new THREE.Vector3(0,2,0),
	rotation: new THREE.Vector3(0,0,0),
	metadata: {
		avatar: 0
	}
}

export function autoSave(){

}

export function recoverUser(){
	// recover user from localStorage
	let user :{[name:string]:any}= {
	}
	if(localStorage.getItem('id') != null){
		user.id = localStorage.getItem('id')
		config.id = user.id
	}
	if(localStorage.getItem('nickname') != null){
		user.nickname = localStorage.getItem('nickname')
	}
	if(localStorage.getItem('metadata') != null){
		try{
			let metadata:any = JSON.parse(localStorage.getItem('metadata') as string)
			user.metadata = metadata
		}catch(e){
		
		}
	}
	
	// recover from URL
	return user
}


