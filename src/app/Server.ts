import Peer from "peerjs"
import {Users} from './Users'
import {User} from './Users'
import {Chat} from "./Chat"
import {initials} from './Config'

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
		const peer = new  Peer(config.id,{
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
			peer.on('connection', function(conn){
				
				if(!Users.hasOwnProperty(conn.peer)){
					Users[conn.peer] = new User(conn.peer, conn)

					conn.on('close', function(){
						console.info(`peer left: "${conn.peer}" `)
						delete Users[conn.peer]
					})

					conn.on('data', function(data){
						Server.dataHandler(conn, data)
					})
				}
			})
		});

		this.discover().then((peers)=>{
			peers.forEach((peer_id)=>{
				let conn = peer.connect(peer_id)
				conn.on('open', function(){
					Users[peer_id] = new User(peer_id, conn)
					
			Server.introduce()
					conn.on('close', function(){
						console.info(`peer left: "${peer_id}" `)
						delete Users[peer_id]
					})

					conn.on('data', function(data){
						Server.dataHandler(conn, data)
					})
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
				let conn = Users[k].conn
				let data = {}
				for(const l of Object.keys(initials)){
					data[l] = Users[k][l]
				}
				console.debug("***",data)
			}
		}
	},
	dataHandler: function(conn, data){
		if(data.constructor == String ){
			Chat.receive(conn.peer,data)
		}
	}
}

window.Server = Server
