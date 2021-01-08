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

	set position(value){
		if(Array.isArray(value) && value.length == 3 && value.every(x => !isNaN(x))){
			this.#position.set(...value)

			let evt = new CustomEvent('moveUser',{
				detail: {
					id: this.#id,
					position: this.#position
				}
			})
			dispatchEvent(evt)
		}
	}
	
	set rotation(value){
		if(Array.isArray(value) && value.length == 3 && value.every(x => !isNaN(x))){
			this.#rotation.set(...value)

			let evt = new CustomEvent('rotateUser',{
				detail: {
					id: this.#id,
					rotation:this.#rotation
				}
			})
			dispatchEvent(evt)
		}
	}

	set metadata(value){
		if(value.constructor == Object){
			for(let k in value){
				if(this.#metadata.hasOwnProperty(k) && this.#metadata[k] != value[k]){
					this.#metadata[k] = value[k]

					let evt = new CustomEvent('changeUser',{
						detail: {
							id: this.#id,
							prop:k,
							value: value[k]
						}
					})
					dispatchEvent(evt)
				}
			}
		}
	}
	describe(){
		return {
			nickname:this.#nickname,
			position: [this.#position.x, this.#position.y, this.#position.z],
			rotation: [this.#rotation.x, this.#rotation.y, this.#rotation.z],
			metadata: this.#metadata
		}
	}
	send(data){
		if(data){
			this.#conn.send(data)
		}
	}

	constructor(id, conn){
		this.#id = id
		this.#conn = conn
		this.#nickname = `${initials.nickname_pre}-${this.#id}`
		this.#position = initials.position
		this.#rotation = initials.rotation
		this.#metadata = initials.metadata
	}
}
export const Users :Users= {	
}

window.Users = Users

window.addEventListener('addUser', function(evt: CustomEvent){
	let id = evt.detail.id
	console.info(`new peer (${id}) `)
})

window.addEventListener('removeUser', function(evt: CustomEvent){
	let id = evt.detail.id
	console.info(`peer left ${id}`)
})

