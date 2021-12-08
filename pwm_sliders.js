const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });
// const Gpio = require('pigpio').Gpio;
// const pin13gpio = new Gpio(13, {mode: Gpio.OUTPUT});
// const pin19gpio = new Gpio(19, {mode: Gpio.OUTPUT});
// const pin18gpio = new Gpio(18, {mode: Gpio.OUTPUT});
// const pin12gpio = new Gpio(12, {mode: Gpio.OUTPUT});

wss.on("connection", ws => {
    console.log("New client connected");
    // LED.writeSync(1);

    ws.on("message", data => {
        let input = JSON.parse(`${data}`);
        console.log(input)
        switch( input ) {
            case 'C':
                console.log("Idle");

                break;
            case 'N':
                console.log('Forward');

            default:
                console.log(input);
        }
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
        // LED.writeSync(0);
    });

});
