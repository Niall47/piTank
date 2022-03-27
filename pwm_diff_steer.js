const Gpio = require('pigpio').Gpio;
const left_pos = new Gpio(13, {mode: Gpio.OUTPUT});
const left_neg = new Gpio(19, {mode: Gpio.OUTPUT});
const right_pos = new Gpio(18, {mode: Gpio.OUTPUT});
const right_neg = new Gpio(12, {mode: Gpio.OUTPUT});
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });


wss.on("connection", ws => {
    console.log("New client connected");

    ws.on("message", data => {
        let input = `${data}`;
        console.log(JSON.parse(input))
        left_pos.pwmWrite(input.X);
        right_pos.pwmWrite(input.Y);
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
    });

});
