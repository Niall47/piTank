const Gpio = require('pigpio').Gpio;
const left_pos = new Gpio(13, {mode: Gpio.OUTPUT});
const left_neg = new Gpio(19, {mode: Gpio.OUTPUT});
const right_pos = new Gpio(18, {mode: Gpio.OUTPUT});
const right_neg = new Gpio(12, {mode: Gpio.OUTPUT});
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });
var diffSteer = require('diff-steer')


wss.on("connection", ws => {
    console.log("New client connected");

    ws.on("message", data => {
        let input = `${data}`;
        console.log(JSON.parse(input))
        power = diffSteer(input.X, input.Y)
        left_pos.pwmWrite(power[0]);
        right_pos.pwmWrite(power[1]);
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
    });

});
