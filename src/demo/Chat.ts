export const Chat = {
    init: function () {
	window.addEventListener("chat", function (event:CustomEvent) {
		const from = window.Users[event.detail.from].nickname
		const msg = event.detail.msg
		let div = document.createElement("div") as HTMLDivElement
		div.innerHTML = `>> [${from}]: ${msg}`;
		(document.querySelector("#chat") as HTMLElement).appendChild(div)
	});

	window.addEventListener("renameUser", function (event:CustomEvent) {
		const oldNickname = event.detail.oldNickname
		const nickname = event.detail.nickname
		
		let div = document.createElement("div")
		div.innerHTML = `[${oldNickname}] renamed to [${nickname}]:`;
		(document.querySelector("#chat") as HTMLElement).appendChild(div)

	});
	
	(document.querySelector("#chat button") as HTMLElement).addEventListener("click", function () {
		const msg = (document.querySelector('#chat input') as HTMLInputElement).value
		if(msg.length == 0) return 
		for(let k in window.Users){
			if(window.Server.peer.id != window.Users[k].id){
				window.Users[k].conn.send(msg)
			}
		}
		
		const from = window.Users.me.nickname
		let div = document.createElement("div") as HTMLDivElement
		div.innerHTML = `>> [${from}]: ${msg}`;
		(document.querySelector("#chat") as HTMLElement).appendChild(div)
	});
    },
};

