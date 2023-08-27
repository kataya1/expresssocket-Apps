const express = require("express");
const app = express();
const expressWs = require("expresssocket")(app);
const websocket = require('ws')

let server = websocket.Server()
app.sRoute("/room/:id", (req, socket, head) => { })

app.listen(3000, () => {
    console.log('app is listening on 3000')
})
