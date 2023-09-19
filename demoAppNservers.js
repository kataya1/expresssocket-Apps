const express = require("express");
const app = express();
const _ = require("express-socket-routes")(app);
const WebSocket = require('ws');

const webSocketServers = {};


app.sRoute('/room/:id', (req, socket, head) => {

    const roomId = req.params.id;

    if (!webSocketServers[roomId]) {
        webSocketServers[roomId] = new WebSocket.Server({ noServer: true });

        webSocketServers[roomId].on('connection', (ws) => {

            ws.on('message', (message) => {
                webSocketServers[roomId].clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(message.toString());
                    }
                });
            });

            ws.on('close', () => {

            });
        });
    }

    webSocketServers[roomId].handleUpgrade(req, socket, head, (ws) => {

        webSocketServers[roomId].emit('connection', ws);
    });

});

const server = app.listen(3000, () => {
    console.log('Server listening on port 3000');
});