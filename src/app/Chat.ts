import {Server} from "./Server"
import {Users} from "./Users"

export const Chat = {
	receive: function(from, msg){
		console.debug(`msg ${from}: ${msg}`)
		let evt = new CustomEvent('chat',{
			detail: {
				from: from,
				msg: msg		
			}
		})
		dispatchEvent(evt)
	},
/*	send: function(msg){
		for(let k in Users){
			if(k!="me"){
				let conn = Users[k].conn
				conn.send(msg)
		
			}	
		}
	}*/
}
