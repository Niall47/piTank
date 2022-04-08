const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });
const Gpio = require('pigpio').Gpio;
const pin13gpio = new Gpio(13, {mode: Gpio.OUTPUT});
const pin19gpio = new Gpio(19, {mode: Gpio.OUTPUT});
const pin18gpio = new Gpio(18, {mode: Gpio.OUTPUT});
const pin12gpio = new Gpio(12, {mode: Gpio.OUTPUT});

wss.on("connection", ws => {
    console.log("New client connected");

    ws.on("message", data => {
        let input = JSON.parse(data);
        console.log(input)
        switch( parseInt(input.pin )) {
            case 13:
                pin13gpio.pwmWrite(input.value);
                break;
            case 19:
                pin19gpio.pwmWrite(input.value);
                break;
            case 18:
                pin18gpio.pwmWrite(input.value);
                break;
            case 12:
                pin12gpio.pwmWrite(input.value);
                break;
            default:
                console.log('Unexpected input')
                console.log(input);
        }
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
        pin13gpio.pwmWrite(0);
        pin19gpio.pwmWrite(0);
        pin18gpio.pwmWrite(0);
        pin12gpio.pwmWrite(0);
    });

});
