import { Users } from "./Users.js";
//
//  validation for incoming data as we don't trust websocket incoming messages
export function check(data) {
    if (!data)
        return false;
    if (!(Array.isArray(data)) ||
        data.length != 10)
        return false;
    const uuid = data[0];
    const nickname = data[1];
    const pos = {
        x: data[2],
        y: data[3],
        z: data[4],
    };
    const rot = {
        x: data[5],
        y: data[6],
        z: data[7],
    };
    const room = data[8];
    let props = {};
    try {
        props = JSON.parse(data[9]);
    }
    catch (e) {
        console.debug("error catching");
    }
    if (!(typeof uuid === "string") ||
        !(typeof nickname === "string" && nickname.length > 0 && nickname.length < 30) ||
        !(typeof room === "string") ||
        !(uuid.length == 13))
        return false;
    if (!pos.hasOwnProperty('x') || !(typeof pos.x === 'number') ||
        !pos.hasOwnProperty('y') || !(typeof pos.y === 'number') ||
        !pos.hasOwnProperty('z') || !(typeof pos.z === 'number'))
        return false;
    if (!rot.hasOwnProperty('x') || !(typeof rot.x === 'number') ||
        !rot.hasOwnProperty('y') || !(typeof rot.y === 'number') ||
        !rot.hasOwnProperty('z') || !(typeof rot.z === 'number'))
        return false;
    return {
        uuid: uuid,
        nickname: nickname,
        room: room,
        pos: pos,
        rot: rot,
        props: props
    };
}
export function checkName(data) {
    if (!(Array.isArray(data) && data.length == 2) ||
        !(typeof data[0] === "string" && data[0].length == 13) ||
        !(typeof data[1] === "string" && data[1].length > 0 && data[1].length < 30))
        return false;
    let uuid = data[0];
    let nickname = data[1];
    if (!Users.hasOwnProperty(uuid))
        return false;
    if (uuid == Users.me.uuid)
        return false;
    if (nickname == Users[uuid].nickname)
        return false;
    return { nickname: nickname, uuid: uuid };
}
export function checkPos(data) {
    if (!(Array.isArray(data) && data.length == 4) ||
        !(typeof data[0] === "string" && data[0].length == 13) ||
        !(typeof data[1] === "number") ||
        !(typeof data[2] === "number") ||
        !(typeof data[3] === "number"))
        return false;
    let uuid = data[0];
    let pos = {
        x: data[1],
        y: data[2],
        z: data[3]
    };
    if (!Users.hasOwnProperty(uuid))
        return false;
    if (uuid == Users.me.uuid)
        return false;
    if (pos == Users[uuid].pos)
        return false;
    return {
        uuid: uuid,
        pos: pos
    };
}
export function checkRot(data) {
    if (!(Array.isArray(data) && data.length == 4) ||
        !(typeof data[0] === "string" && data[0].length == 13) ||
        !(typeof data[1] === "number") ||
        !(typeof data[2] === "number") ||
        !(typeof data[3] === "number"))
        return false;
    let uuid = data[0];
    let rot = {
        x: data[1],
        y: data[2],
        z: data[3]
    };
    if (!Users.hasOwnProperty(uuid))
        return false;
    if (uuid == Users.me.uuid)
        return false;
    if (rot == Users[uuid].rot)
        return false;
    return {
        uuid: uuid,
        rot: rot
    };
}
export function checkProp(data) {
    if (!(Array.isArray(data) && data.length == 3) ||
        !(typeof data[0] === "string" && data[0].length == 13))
        return false;
    let uuid = data[0];
    let prop = data[1];
    let value = data[2];
    /*
        if(!Environment.api) {
            if(!Users.hasOwnProperty(uuid)) return false
            if(uuid == Users.me.uuid) return false
            if(!Users[uuid].props.hasOwnProperty(prop)) return false
            if(value == Users[uuid].props[prop]) return false
        }
        */
    return {
        uuid: uuid,
        prop: prop,
        value: value
    };
}
export function checkChatdata(data) {
    if (!(Array.isArray(data) && data.length == 2 && data[1].length < 200))
        return false;
    let uuid = data[0];
    let msg = data[1];
    if (!Users.hasOwnProperty(uuid))
        return false;
    if (uuid == Users.me.uuid)
        return false;
    return { uuid: uuid, msg: msg };
}
export function checkChat(data) {
    if (!(typeof data === "string" && data.length > 0 && data.length < 200))
        return false;
    /*
        let uuid = data[0]
        let msg = data[1]

        if(uuid == Users.me.uuid) return false
        if(msg.length>200) return false
        return {
                uuid: uuid,
                msg: msg
        }
      */
    return true;
}
