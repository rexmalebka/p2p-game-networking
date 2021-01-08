function checkName(uuid, nickname) {
    if (nickname.length == 0)
        return false;
    if (Users[uuid].nickname == nickname)
        return false;
    return true;
}
function checkPos(uuid, pos) {
    if (!(pos.hasOwnProperty('x')) ||
        !(pos.hasOwnProperty('y')) ||
        !(pos.hasOwnProperty('z')) ||
        !(typeof pos.x == "number") ||
        !(typeof pos.y == "number") ||
        !(typeof pos.z == "number") ||
        (pos.x == Users[uuid].pos.x && pos.y == Users[uuid].pos.y && pos.z == Users[uuid].pos.z)
    )
        return false;
    return true;
}
function checkRot(uuid, rot) {
    if (!(rot.hasOwnProperty('x')) ||
        !(rot.hasOwnProperty('y')) ||
        !(rot.hasOwnProperty('z')) ||
        !(typeof rot.x == "number") ||
        !(typeof rot.y == "number") ||
        !(typeof rot.z == "number") ||
        (rot.x == Users[uuid].rot.x && rot.y == Users[uuid].rot.y && rot.z == Users[uuid].rot.z)
    )
        return false;
    return true;
}
export class User {
    constructor({ uuid = "", nickname = "", pos = {}, rot = {}, room, props = {} }) {
        if (!pos.hasOwnProperty('x') || !(typeof pos.x === 'number') ||
            !pos.hasOwnProperty('y') || !(typeof pos.y === 'number') ||
            !pos.hasOwnProperty('z') || !(typeof pos.z === 'number')) {
            pos = { x: 0, y: 0, z: 0 };
        }
        if (!rot.hasOwnProperty('x') || !(typeof rot.x === 'number') ||
            !rot.hasOwnProperty('y') || !(typeof rot.y === 'number') ||
            !rot.hasOwnProperty('z') || !(typeof rot.z === 'number')) {
            rot = { x: 0, y: 0, z: 0 };
        }
        if (!room) {
            room = "default";
        }
        if (!uuid || uuid.length != 13) {
            uuid = Math.random().toString(16).substr(2);
        }
        this.uuid = uuid;
        this.nickname = nickname;
        this.pos = pos;
        this.rot = rot;
        this.room = room;
        if (Object.keys(props).length > 0) {
            this.props = props;
        }
        else {
            this.props = {
		avatar: 0,
		level:0,
		misc:0
            };
        }
        this.add = new CustomEvent('addUser', {
            detail: { uuid: uuid }
        });
        this.leave = new CustomEvent('removeUser', {
            detail: {
                uuid: this.uuid,
                nickname: this.nickname,
                pos: this.pos,
                rot: this.rot,
                room: this.room,
            }
        });
        this.rename = new CustomEvent('renameUser', {
            detail: {
                uuid: uuid,
                oldName: nickname
            }
        });
        this.move = new CustomEvent('moveUser', {
            detail: {
                uuid: uuid,
                oldPos: pos,
                pos: pos
            }
        });
        this.rotate = new CustomEvent('rotateUser', {
            detail: {
                uuid: uuid,
                rot: rot
            }
        });
        this.change = new CustomEvent('changeUser', {
            detail: {
                uuid: uuid,
                prop: "",
                value: ""
            }
        });
    }
}
export const Users = new Proxy({}, {
    get: function (target, uuid) {
        if (uuid == "me" && !target.hasOwnProperty("me"))
            return new User({});
        if (uuid == "users")
            return target;
        return target[uuid];
    },
    set: function (target, uuid, user) {
        /*
        if(target.hasOwnProperty(uuid)){
            return false
        }
        if(uuid == 'me'){

            user.add.detail.uuid = 'me'
            user.rename.detail.uuid = 'me'
            user.leave.detail.uuid = 'me'
            user.change.detail.uuid = 'me'
            user.move.detail.uuid = 'me'
            user.rotate.detail.uuid = 'me'
            user.change.detail.uuid = 'me'
        }
            */
        user.add.detail.uuid = uuid;
        user.rename.detail.uuid = uuid;
        user.leave.detail.uuid = uuid;
        user.change.detail.uuid = uuid;
        user.move.detail.uuid = uuid;
        user.rotate.detail.uuid = uuid;
        user.change.detail.uuid = uuid;
        target[uuid] = new Proxy(user, {
            get: function (target, prop) {
                if (prop == "pos") {
                    return new Proxy(target.pos, {
                        get: function (pos, prop) {
                            return pos[prop];
                        },
                        set: function (pos, prop, value) {
                            if (!pos.hasOwnProperty(prop) ||
                                !(typeof value == "number"))
                                return true;
                            value = value;
                            pos[prop] = value;
                            target.move.detail.pos = pos;
                            dispatchEvent(target.move);
                            return true;
                        }
                    });
                }
                if (prop == "rot") {
                    return new Proxy(target.rot, {
                        get: function (rot, prop) {
                            return rot[prop];
                        },
                        set: function (rot, prop, value) {
                            if (!rot.hasOwnProperty(prop) ||
                                !(typeof value == "number"))
                                return true;
                            value = value;
                            rot[prop] = value;
                            target.rotate.detail.rot = rot;
                            dispatchEvent(target.rotate);
                            return true;
                        }
                    });
                }
                if (target.props.hasOwnProperty(prop))
                    return target.props[prop];
                return target[prop];
            },
            set: function (target, prop, value) {
                if (prop == 'uuid' || prop == 'room')
                    return false;
                if (prop == 'nickname' && target.nickname != value) {
                    if (!checkName(uuid, value))
                        return true;
                    target.rename.detail.oldName = target.nickname;
                    target.nickname = value;
                    dispatchEvent(target.rename);
                    return true;
                }
                else if (prop == 'pos' && target.pos != value) {
                    if (!checkPos(uuid, value))
                        return true;
                    value.x = value.x;
                    value.y = value.y;
                    value.z = value.z;
                    target.pos = value;
                    target.move.detail.pos = value;
                    dispatchEvent(target.move);
                    return true;
                }
                else if (prop == 'rot' && target.rot != value) {
                    if (!checkRot(uuid, value))
                        return true;
                    value.x = value.x;
                    value.y = value.y;
                    value.z = value.z;
                    target.rot = value;
                    target.rotate.detail.rot = value;
                    dispatchEvent(target.rotate);
                    return true;
                }
                target.props[prop] = value;
                target.change.detail.prop = prop.toString();
                target.change.detail.value = value;
                dispatchEvent(target.change);
                return true;
            }
        });
        /*
    }else{
        target[uuid] = user
    }
         */
        return true;
    },
    has: function (target, prop) {
        return target.hasOwnProperty(prop);
    },
    deleteProperty: function (target, user) {
        if (user in target) {
            delete target[user];
        }
        return true;
    }
});
document.querySelector("#nickname_form input").addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        event.preventDefault();
        Users["me"].nickname = event.target.value;
        //dispatchEvent(Users["me"].rename)
    }
}, false);
document.querySelector("#nickname_form a").addEventListener("click", function (event) {
    Users["me"].nickname = document.querySelector("#nickname_form input").value;
    //event.preventDefault()
});
window.Users = Users;
window.addEventListener("addUser", function (event) {
    const uuid = event.detail.uuid;
    console.info(`User '${Users[uuid].nickname}' (${uuid}) enter.`);
    document.querySelector("#online_number").textContent = Object.keys(Users.users).length.toString();
    if (uuid == "me") {
        document.querySelector("#nickname").textContent = Users["me"].nickname;
    }
});
window.addEventListener("removeUser", function (event) {
    const uuid = event.detail.uuid;
    const nickname = event.detail.uuid;
    console.info(`User '${Users[uuid].nickname}' (${uuid}) left.`);
    document.querySelector("#online_number").textContent = (Object.keys(Users.users).length - 1).toString();
});
window.addEventListener("renameUser", function (event) {
    const uuid = event.detail.uuid;
    let oldName = event.detail.oldName;
    if (!(uuid == "me"))
        console.info(`\tUser '${oldName}' (${uuid}) renamed to ${Users[uuid].nickname}`);
});
window.addEventListener("changeUser", function (event) {
    const uuid = event.detail.uuid;
    let prop = event.detail.prop;
    let value = event.detail.value;
    if (!(uuid == "me"))
        console.info(`\tUser '${Users[uuid].nickname}' (${Users[uuid].uuid}) changed ${prop} to ${value}`);
});
