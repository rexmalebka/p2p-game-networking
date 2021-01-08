
export const Streaming = {
    init: function () {
	    document.querySelector("#close-info").addEventListener("click", function () {	    
		    /*document.querySelector("#test").src = "/video/laverdad.mp4"
		    document.querySelector("#test").play()
		    */
		let evt = new CustomEvent('startStream', {detail: { id: "test"} }) 
		dispatchEvent(evt)
		
	})
    }
}
/*
export const Streaming = {
    init: function () {
        document.querySelector("#close-info").addEventListener("click", function () {

		window.addEventListener("changeUser", function(event){
			let uuid = event.detail.uuid

			if(!uuid == '01800-api-666') return

			let prop = event.detail.prop
			let value = event.detail.value

			if(!(prop == "domo"  || 
				prop == "sala1" ||
				prop == "sala2" ||
				prop == "sala3" ||
				prop == "jardin"
			)) return
			if(!prop) return

			let sala = prop
			if(value.endsWith(".m3u8")){


				// stop previous sala

				if(Scene.salas.hasOwnProperty(sala)) {
					if(Scene.salas[sala].type == "flv"){
						Scene.salas[sala].player.unload()
					}else{
						Scene.salas[sala].player.destroy()
					}
				}


				let video = document.querySelector(`#${sala}`);
				console.debug("VIDEO HLS", video)
				if (Hls.isSupported()) {
					try{
						let hls = new Hls();
						hls.loadSource(value);
						hls.attachMedia(video);
						
						Scene.salas[sala] = {type: "m3u8", player:hls}

						hls.on(Hls.Events.MANIFEST_PARSED, function() {
							video.play();

							let evt = new CustomEvent('startStream', {detail: { type: "m3u8", id: sala} }) 
							dispatchEvent(evt)
						});
					}catch (e){
						console.info("Error loading hls streaming")
					}

				}else{
					console.debug("HLS ño supported")
				}

			}else{
				if(Scene.salas.hasOwnProperty(sala)) {
					if(Scene.salas[sala].type == "flv"){
						Scene.salas[sala].player.unload()
					}else{
						Scene.salas[sala].player.destroy()
					}
				}

				if (flvjs.isSupported()) {
					try{
						let flvPlayer = flvjs.createPlayer({
						    type: "flv",
						    isLive: true,
						    url: value
						});
						flvPlayer.attachMediaElement(document.querySelector(`#${sala}`));
						flvPlayer.load();
						flvPlayer.play();

						Scene.salas[sala] = {type: "flv", player:flvPlayer}

						flvPlayer.on('error', function (err) {
						    if (err === "NetworkError") {
							flvPlayer.unload();
							flvPlayer.load();
							flvPlayer.play();
						    }
						});

						let evt = new CustomEvent('startStream', {detail: { type: "flv", id: sala} }) 
						dispatchEvent(evt)
					    }catch(e){
						    console.info("Error loading flv")
					    }
						}

					}

		})

		///////


		let uuid = '01800-api-666'
		if(!(Users.hasOwnProperty('01800-api-666') || Users.me.uuid == '01800-api-666')) return
		if(Users.me.uuid == '01800-api-666' ) uuid = "me"
			let domo = Users[uuid].domo
			let sala1 = Users[uuid].sala1
			let sala2 = Users[uuid].sala2
			let sala3 = Users[uuid].sala3
			let jardin = Users[uuid].sala4

			let salas = {
				domo:domo, 
				sala1:sala1, 
				sala2:sala2, 
				sala3:sala3, 
				jardin:jardin
			}

			Object.entries(salas).forEach(function(args){
				let sala = args[1]
				let id = args[0]

				if(!sala) return

				if(sala.endsWith(".m3u8")){


					if(Scene.salas.hasOwnProperty(sala)) {
						if(Scene.salas[sala].type == "flv"){
							Scene.salas[sala].player.unload()
						}else{
							Scene.salas[sala].player.destroy()
						}
					}

					let video = document.querySelector(`#${id}`);
					console.debug("VIDEO HLS", video)
					if (Hls.isSupported()) {
						let hls = new Hls();
						hls.loadSource(sala);
						hls.attachMedia(video);
						hls.on(Hls.Events.MANIFEST_PARSED, function() {
						console.debug("HLS aqui ")
							video.play();

							let evt = new CustomEvent('startStream', {detail: { type: "m3u8", id: id} }) 
							dispatchEvent(evt)
						});

						Scene.salas[sala] = {type: "m3u8", player:hls}

					}else{
						console.debug("HLS ño supported")
					}
				}else{

				if(Scene.salas.hasOwnProperty(id)) {
					if(Scene.salas[id].type == "flv"){
						Scene.salas[id].player.unload()
					}else{
						Scene.salas[id].player.destroy()
					}
				}

				    if (flvjs.isSupported()) {
					let flvPlayer = flvjs.createPlayer({
					    type: "flv",
					    isLive: true,
					    url: sala
					});
					flvPlayer.attachMediaElement(document.querySelector(`#${id}`));
					flvPlayer.load();
					flvPlayer.play();
					flvPlayer.on('error', function (err) {
					    if (err === "NetworkError") {
						flvPlayer.unload();
						flvPlayer.load();
						flvPlayer.play();
					    }
					});
				        Scene.salas[id] = {type: "flv", player: flvPlayer}
					    
					let evt = new CustomEvent('startStream', {detail: { type: "flv", id: id} }) 
					dispatchEvent(evt)
				    }

				}
			})
	})
    }
}


window.addEventListener("addUser",function(event){
	let uuid = event.detail.uuid
	if(uuid != '01800-api-666') return
	
	let domo = Users[uuid].domo
	let sala1 = Users[uuid].sala1
	let sala2 = Users[uuid].sala2
	let sala3 = Users[uuid].sala3
	let jardin = Users[uuid].sala4


			let salas = {
				domo:domo, 
				sala1:sala1, 
				sala2:sala2, 
				sala3:sala3, 
				jardin:jardin
			}

			Object.entries(salas).forEach(function(args){
				let sala = args[1]
				let id = args[0]

				if(!sala) return

				if(sala.endsWith(".m3u8")){


					if(Scene.salas.hasOwnProperty(sala)) {
						if(Scene.salas[sala].type == "flv"){
							Scene.salas[sala].player.unload()
						}else{
							Scene.salas[sala].player.destroy()
						}
					}

					let video = document.querySelector(`#${id}`);
        document.querySelector("#close-info").addEventListener("click", function () {
					if (Hls.isSupported()) {
						let hls = new Hls();
						hls.loadSource(sala);
						hls.attachMedia(video);
						hls.on(Hls.Events.MANIFEST_PARSED, function() {
						console.debug("HLS aqui ")
							video.play();

							let evt = new CustomEvent('startStream', {detail: { type: "m3u8", id: id} }) 
							dispatchEvent(evt)
						});

						Scene.salas[sala] = {type: "m3u8", player:hls}

					}else{
						console.debug("HLS ño supported")
					}
	})
				}else{

				if(Scene.salas.hasOwnProperty(id)) {
					if(Scene.salas[id].type == "flv"){
						Scene.salas[id].player.unload()
					}else{
						Scene.salas[id].player.destroy()
					}
				}

        document.querySelector("#close-info").addEventListener("click", function () {
				    if (flvjs.isSupported()) {
					let flvPlayer = flvjs.createPlayer({
					    type: "flv",
					    isLive: true,
					    url: sala
					});
					flvPlayer.attachMediaElement(document.querySelector(`#${id}`));
					flvPlayer.load();
					flvPlayer.play();
					flvPlayer.on('error', function (err) {
					    if (err === "NetworkError") {
						flvPlayer.unload();
						flvPlayer.load();
						flvPlayer.play();
					    }
					});
				        Scene.salas[id] = {type: "flv", player: flvPlayer}
					    
					let evt = new CustomEvent('startStream', {detail: { type: "flv", id: id} }) 
					dispatchEvent(evt)
				    }
	})

				}
			})
		})
		*/
