import Peer from "peerjs"
import {Users} from './Users'
import {User} from './Users'
import {Chat} from "./Chat"
import {initials, recoverUser} from './Config'

declare global {
	interface Window { Server: any }
}

export interface Server {
	init: Function
	discover: Function
	dataHandler: Function
	introduce: Function
	config: any
	peer?: Peer
	id?: string
}

export const Server :Server = {
	config: {},
	init: function(config: any){
		const user_skel = recoverUser()
		const peer = new Peer(config.id,{
			host: "127.0.0.1",
			port: 3000,
			path: "/net"
		})

		this.peer = peer
		this.config = config

		const id = this.config.id
		peer.on('open', function(id) {
			console.log('My peer ID is: ' + id);	
			Users.me = new User(id, peer)

			let evt:CustomEvent = new CustomEvent('addUser',{
				detail: {
					id: Users.me.id
				}
			})
			dispatchEvent(evt)

			for(let k in user_skel){
				Users.me[k] = user_skel[k]
			}

			peer.on('connection', function(conn){
				
				if(!Users.hasOwnProperty(conn.peer)){
					Users[conn.peer] = new User(conn.peer, conn)
					
					let evt:CustomEvent = new CustomEvent('addUser',{
						detail: {
							id: Users[conn.peer].id,
						}
					})
					dispatchEvent(evt)


					conn.on('open',function(){
						Users[conn.peer].send(Users.me.describe())
					})

					conn.on('close', function(){
						console.debug("closing peer", conn)
						let user = Users[conn.peer].describe()
						user.id = Users[conn.peer].id
						delete Users[conn.peer]
						
						let evt = new CustomEvent('removeUser',{
							detail: user 
						})
						dispatchEvent(evt)

					})

					conn.on('data', function(data){
						Server.dataHandler(conn, data)
					})
				}
			})
		});

		peer.on('error', function(reason){
			let evt = new CustomEvent('peerError',{
				detail: {
					peer: peer,
					reaason: reason
				}
			})
			dispatchEvent(evt)
		})

		this.discover().then((peers)=>{
			peers.forEach((peer_id)=>{
				let conn = peer.connect(peer_id)
				conn.on('open', function(){
					Users[peer_id] = new User(peer_id, conn)
					
					let evt:CustomEvent = new CustomEvent('addUser',{
						detail: {
							id: Users[peer_id].id,
						}
					})
					dispatchEvent(evt)
					
					Server.introduce()


					conn.on('data', function(data){
						Server.dataHandler(conn, data)
					})
				})

					conn.on('close', function(){
						let user = Users[conn.peer].describe()
						user.id = Users[conn.peer].id
						delete Users[conn.peer]
						
						let evt = new CustomEvent('removeUser',{
							detail: user 
						})
						dispatchEvent(evt)
					})
			})
		})
	}, 
	discover: function(){
		const id = this.config.id
		const room = this.config.room
		return new Promise((resolve, reject) =>{
			fetch(`/peers-disc/${room}`,{method: "GET"}).then((res)=>{
				return res.json().then((data)=>{
					if(res.status == 200){
						let peers = data.filter(x => x!= id).map( peer_id =>{
							return peer_id
						})
						resolve(peers)
					}else{
						reject()
					}
				})
			}).catch(()=>{
				console.error("unable to connect server")
				reject()
			})
		})
	},
	introduce: function(){
		const id = this.config.id

		for(let k in Users){
			if(k!="me"){
				Users[k].send(Users.me.describe())
			}
		}
	},
	dataHandler: function(conn, data){
		if(data.constructor == String ){
			// simple chat
			Chat.receive(conn.peer,data)
		}else if(data.constructor == Object){
			// send user information
			for(const [k,v] of Object.entries(data)){
				Users[conn.peer][k] = v
			}
		}else if(data.constructor == Blob){
			// sending custom glb avatar
		}
	}
}

window.Server = Server

window.addEventListener('renameUser', function(event: CustomEvent){
	const id = event.detail.id
	if(id == (Server.peer as Peer).id){
		for(let k in Users){
			if(k != "me") Users[k].send({nickname: event.detail.nickname})
		}
	}
})

window.addEventListener('moveUser', function(event: CustomEvent){
	const id = event.detail.id
	if(id == (Server.peer as Peer).id){
		const  pos = event.detail.position
		for(let k in Users){
			if(k != "me") Users[k].send({position: [pos.x, pos.y, pos.z]})
		}
	}
})

window.addEventListener('rotateUser', function(event: CustomEvent){
	const id = event.detail.id
	if(id == (Server.peer as Peer).id){
		const  rot = event.detail.rotation
		for(let k in Users){
			if(k != "me") Users[k].send({position: [rot.x, rot.y, rot.z]})
		}
	}
})
