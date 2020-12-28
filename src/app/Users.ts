import * as THREE from 'THREE'
import {Server} from './Server'
import {initials} from './Config'

declare global {
    interface Window { Users: any; }
}


export interface Users {
	[name:string] : any
}

export class User {
	#id
	#conn
	#nickname
	#position
	#rotation
	#metadata

	get nickname() {return this.#nickname}
	get id() {return this.#id}
	get conn() {return this.#conn}
	get position() {return this.#position}
	get rotation() {return this.#rotation}
	get metadata() {return this.#metadata}

	set nickname(value){
		if(this.#nickname != value){
			let evt = new CustomEvent('renameUser',{
				detail: {
					id: this.#id,
					nickname: value,
					oldNickname: this.#nickname
				}
			})
			dispatchEvent(evt)
			this.#nickname = value
		}
	}

	move(pos:THREE.Vector3){
		if(pos != this.#position && pos.constructor == THREE.Vector3){
			this.#position = pos
			let evt = new CustomEvent('moveUser',{
				detail: {
					id: this.#id,
					position: pos
				}
			})
			dispatchEvent(evt)
		}
	}
	
	rotate(rot:THREE.Vector3){
		if(rot != this.#rotation && rot.constructor == THREE.Vector3){
			this.#rotation = rot
			let evt = new CustomEvent('rotateUser',{
				detail: {
					id: this.#id,
					rotation:rot
				}
			})
			dispatchEvent(evt)
		}
	}
	
	change(prop, value){
		if(this.#metadata.hasOwnProperty(prop) && this.#metadata[prop] != value){
			this.#metadata[prop] = value
			let evt = new CustomEvent('changeUser',{
				detail: {
					id: this.#id,
					prop:prop,
					value: value
				}
			})
			dispatchEvent(evt)
		}
	}

	constructor(id, conn){
		this.#id = id
		this.#conn = conn
		this.#nickname = `${initials.nickname}${this.#id}`
		this.#position = initials.position
		this.#rotation = initials.rotation
		this.#metadata = initials.metadata
		
		let evt:CustomEvent = new CustomEvent('addUser',{
			detail: {
				id: this.#id,
			}
		})
		dispatchEvent(evt)
	}
}
export const Users :Users= {	
}

window.Users = Users

window.addEventListener('addUser', function(evt: CustomEvent){
	let id = evt.detail.id
	console.info(`new peer (${id}) `)
})

window.addEventListener('moveUser', function(evt: CustomEvent){
	let id = evt.detail.id
	console.info(" user moving eveent")
})

