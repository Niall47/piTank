const Gpio = require('pigpio').Gpio;
const left_pos = new Gpio(13, {mode: Gpio.OUTPUT});
const left_neg = new Gpio(19, {mode: Gpio.OUTPUT});
const right_pos = new Gpio(18, {mode: Gpio.OUTPUT});
const right_neg = new Gpio(12, {mode: Gpio.OUTPUT});
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });
var diffSteer = require('diff-steer')

// pigpio.initialize(); 
wss.on("connection", ws => {
    console.log("New client connected");

    ws.on("message", data => {
        let input = `${data}`;
        cleanInput = JSON.parse(input);
        power = diffSteer(parseInt(cleanInput.X), parseInt(cleanInput.Y));
        console.log('-----------------------');
        console.log(power);
        console.log('-----------------------');
        console.log(cleanInput);
        console.log('-----------------------');
        console.log(power);
        console.log('-----------------------');
        console.log(diffSteer(1,0));
        console.log('-----------------------');
        // if (parseInt(power[0]) < 0) {
        //     left_pos.pwmWrite(power[0] * -1);
        //     left_neg.pwmWrite(power[0] * -1);
        // } else {
        //     left_pos.pwmWrite(power[0]);
        //     left_neg.pwmWrite(0);
        // };
        // if (parseInt(power[1]) <= 0) {
        //     right_pos.pwmWrite(power[1] * -1);
        //     right_neg.pwmWrite(power[1] * -1);
        // } else {
        //     right_pos.pwmWrite(power[1]);
        //     right_neg.pwmWrite(0);
        // };
        // left_pos.pwmWrite(power[0]);
        // right_pos.pwmWrite(power[1]);
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
    });

});


// process.on('SIGINT', () => {
//     led.digitalWrite(0);
//     pigpio.terminate(); // pigpio C library terminated here
//     clearInterval(iv);
//     console.log('Terminating...');
//   });
  