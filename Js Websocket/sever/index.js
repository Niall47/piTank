const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", ws => {
    console.log("New client connected");

    ws.on("message", data => {
        console.log(`Client has sent: ${data}`);
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
    });
});