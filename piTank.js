const Gpio = require('pigpio').Gpio;
const left_pos = new Gpio(13, {mode: Gpio.OUTPUT});
const left_neg = new Gpio(19, {mode: Gpio.OUTPUT});
const right_pos = new Gpio(18, {mode: Gpio.OUTPUT});
const right_neg = new Gpio(12, {mode: Gpio.OUTPUT});
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });


// pigpio.initialize(); 
wss.on("connection", ws => {
    console.log("New client connected");

    ws.on("message", data => {
        let input = `${data}`;
        cleanInput = JSON.parse(input);
       driveMotors(cleanInput.left, cleanInput.right);
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
    });

});
function driveMotors(left,right){
    left = calculateInput(left);
    right = calculateInput(right);

    // left_pos.pwmWrite(left[0]);
    // left_neg.pwmWrite(left[1]);
    // right_pos.pw mWrite(right[0]);
    // right_neg.pwmWrite(right[1]);

    console.log('Left: ' + left +  '   Right: ' + right);
};


function calculateInput(percentage){
    if (percentage === 0 ){
        return [0,0]
    } else if (percentage > 0){
        console.log(percentage);
    } else if (percentage < 0){
        console.log(percentage)
    };
};