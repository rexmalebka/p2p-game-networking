import * as THREE from "THREE"

declare global{
	interface Window{
		Avatar:any
	}
}

export const Avatar = {
	offsetY: -1,
	avatar: new THREE.Group(),
	avatars: {},
	init: function(Scene){
		let geom = new THREE.TetrahedronBufferGeometry(1, 1)
		let mat = new THREE.MeshStandardMaterial({side:THREE.DoubleSide})

		let avt = new THREE.Mesh(geom, mat)
		this.avatar.add(avt)

		for(let id in window.Users){
			const pos = window.Users[id].position
			console.debug("asdfsdf",pos,id)
			Avatar.addAvatar(Scene, id, pos)
		}

		window.addEventListener('addUser',function(event :CustomEvent){
			let position;
			if(event.detail.id == window.Server.peer.id){
				position = window.Users.me.position
			}else{
				position = window.Users[event.detail.id].position
			}
			Avatar.addAvatar(Scene, event.detail.id, position)
		})
		
		window.addEventListener('moveUser', function(event: CustomEvent){
			const position = event.detail.position
			const id = event.detail.id
			Avatar.avatars[id].position.set(position.x, position.y + Avatar.offsetY, position.z)
		})
		
		window.addEventListener('removeUser', function(event: CustomEvent){
			const id = event.detail.id
			let avt = Avatar.avatars[id]
			avt.children.forEach(m =>{
				m.geometry.dispose()
				m.material.dispose()
				avt.remove(m)
			})
			Scene.scene.remove(avt)
			Scene.renderer.renderLists.dispose()
			delete Avatar.avatars[id]
		})

	},
	addAvatar: function(Scene, id, pos){
		let avt = Avatar.avatar.clone()

		avt.position.set(pos.x, pos.y + Avatar.offsetY, pos.z)
		Avatar.avatars[id] = avt
		
		Scene.scene.add(avt)
	}
}

window.Avatar = Avatar
