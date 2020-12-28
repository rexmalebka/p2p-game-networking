import {Server} from "./Server"
import {Users} from "./Users"

declare global{
	interface Window {Chat: any}
}

export const Chat = {
	receive: function(from, msg){
		console.debug(`msg ${from}: ${msg}`)
	},
	send: function(msg){
		for(let k in Users){
			if(k!="me"){
				let conn = Users[k].conn
				conn.send(msg)
		
			}	
		}
	}
}
window.Chat = Chat
