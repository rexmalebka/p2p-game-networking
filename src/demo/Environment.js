import { Users } from "./Users.js";
export const Environment = {
    room: "navidad",
    //initialPos: { x: 2.8233879059397813, y: 1.6999999999997357, z: 379.41482997209545},
    initialPos: {x: -149.3707587321442, y: 1.6999999999996191, z: 292.4606004426705},
    initialRot: { x: 0, y: 0, z: 0 },
    api: true
};
export function retrieveData() {
    let params = {};
    // get params from local Storage
    let uuid = localStorage.getItem("uuid");
    let nickname = localStorage.getItem("nickname");
    let props = localStorage.getItem("props");
    if (!uuid || uuid.length != 13) {
        uuid = Math.random().toString(16).substr(2);
    }
    if (!nickname) {
        nickname = `anon-${Math.random().toString(16).substr(2, 4)}`;
    }
    if (props) {
        try {
            props = JSON.parse(props);
        }
        catch (e) {
            props = {};
        }
    }
    let url = new URL(window.location.href);
    let api = url.searchParams.get("api");
    let nickname_url = url.searchParams.get("nickname");
    let props_url = url.searchParams.get("props");
    if (nickname_url) {
        nickname = nickname_url;
    }
    if (props_url) {
        try {
            props_url = JSON.parse(nickname_url);
        }
        catch (e) {
            props_url = {};
        }
    }
    if (api) {
        Environment.api = true;
        uuid = "01800-api-666";
    }
	if(props_url) props = props_url;
    localStorage.setItem("uuid", uuid);
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("props", JSON.stringify(props));
    return {
        uuid: uuid,
        nickname: nickname,
        props: props
    };
}
window.addEventListener("renameUser", function (event) {
    const uuid = event.detail.uuid;
    if (uuid == "me") {
        localStorage.setItem("nickname", Users.me.nickname);
    }
});
window.addEventListener("changeUser", function (event) {
    const uuid = event.detail.uuid;
    let prop = event.detail.prop;
    let value = event.detail.value;
    if (uuid == "me" || uuid == "01800-api-666") {
        let props = localStorage.getItem("props");
        if (!props) {
            try {
                props = JSON.parse(props);
            }
            catch (e) {
                props = {};
            }
        }
        else {
            props = {};
        }
        props[prop] = value;
        localStorage.setItem("props", JSON.stringify(props));
    }
});
