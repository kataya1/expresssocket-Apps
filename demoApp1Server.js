const express = require("express");
const app = express();
const expressWs = require("../../expresssocket")(app);
const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({ noServer: true });

const rooms = {};

webSocketServer.on('connection', (webSocket, req) => {

    const roomId = req.params.id;

    if (!rooms[roomId]) {
        rooms[roomId] = [];
    }

    rooms[roomId].push(webSocket);
    console.log('connected, roomId', roomId)
    webSocket.on('message', message => {
        console.log(message.toString())
        rooms[roomId].forEach(client => {
            if (client !== webSocket) {
                client.send(message.toString());
            }
        });

    });

    webSocket.on('close', () => {
        rooms[roomId] = rooms[roomId].filter(client => client !== webSocket);
    });

});


app.sRoute("/room/:id", (request, socket, head) => {

    webSocketServer.handleUpgrade(request, socket, head, webSocket => {
        webSocketServer.emit('connection', webSocket, request);

    });

});


app.listen(3000, () => {
    console.log('app listening on port 3000')
});