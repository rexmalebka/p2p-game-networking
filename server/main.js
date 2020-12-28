"use strict";
const express = require('express');
const { ExpressPeerServer } = require('peer');
const bodyParser = require("body-parser");
const app = express();
const Users = {
    "default": []
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static('../static'));
app.get('/peers-disc/:room', function (req, res) {
    console.debug("req ", req.params);
    if (Users.hasOwnProperty(req.params.room)) {
        res.send(Users[req.params.room]);
    }
    else {
        res.send({});
    }
});
const server = app.listen(3000);
const peerServer = ExpressPeerServer(server, {
    path: '/'
});
app.use('/net', peerServer);
peerServer.on('connection', function (conn) {
    console.debug("new connection: ", conn.id);
    const id = conn.id;
    if (id.split('-').length == 2) {
        const room = id.split('-')[0];
        if (!Users.hasOwnProperty(room)) {
            Users[room] = [];
        }
        Users[room].push(id);
    }
    else {
        Users.default.push(id);
    }
});
peerServer.on('disconnect', function (conn) {
    console.debug("leaving: ", conn.id);
    const id = conn.id;
    let room = "default";
    if (id.split('-').length == 2) {
        room = id.split('-')[0];
    }
    let indx = Users[room].indexOf(id);
    Users[room].splice(indx, 1);
});
