import * as THREE from 'three'
const room = "default"
const uuid = Math.random().toString(16).substr(2)

export const config = {
	id: `${room}-${uuid}`,
	room: room
}

export const initials = {
	nickname: `player-`,
	position: new THREE.Vector3(0,0,0),
	rotation: new THREE.Vector3(0,0,0),
	metadata: {
		avatar: 0
	}
}
