export const API = {
    "/bg": function (data) {
        console.debug("changing bg", data);
    },
   "domo": function(event){
	let detail = event.detail
	console.debug("changing domo", detail)
   }
};
