# P2P Game Networking

using Peerjs technology to avoid using massive large expensive servers bandwith and offer less lag on players network

## HOW

Install dependencies, for bundling, etc;

> npm install 

Configure room name / initial values for each User at `src/app/Config.js` 

> npm run build

run dev mode with PeerServer for Discovering

> npm run dev

Go to [127.0.0.1:3000](127.0.0.1:3000)

## User

A user is an abstraction of a player in a space, containig the following properties:

| User |
|------  User

A user is an abstraction of a player in a space, containig the following properties:

- id
- position
- rotation
- metadata
- describe()
- send()

## Custom Events

Plugable way to attach events to actions, it's necessary to create event listeners

```javascript
window.addEventListener('addUser', function(event){
    const detail = event.detail; // contains information of the Custom Event
    console.info(`new user added ${detail.id}`);
})
```

| event | description | detail |
| --------- | ----------- | ----- |
| `addUser` | dispatched when a new user is added. | id |
| `removeUser` | dispatched when a user leaves. | id, nickname, position, rotation, metadata | 
| `renameUser` | dispatched when a user changes its `nickname` property. | id, nickname, oldNickname |
| `moveUser` | dispatched when a user changes its `position` property. | id, position |
| `rotateUser` | dispatched when a user changes its `rotation` property. | id, rotation |
| `changeUser` | dispatched when a user changes its ` metadata` property. | id, prop, value |
| `peerError` | dispatched when a p2p error happens. | peer, reason |
| `chat` | dispatched when a message is received | from, msg |


## The future

1.- wait for three js to convert everything to ES6 for better size bundling
2.- research about gzip js
3.- Create policies for blocking annoying people
