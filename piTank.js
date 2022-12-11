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

    left_inputs = pwmValue(left);
    right_inputs = pwmValue(right);
    console.log(pwmValue(left) + '    '+ pwmValue(right));
    left_pos.pwmWrite(left_inputs[0]);
    left_neg.pwmWrite(left_inputs[1]);
    right_pos.pwmWrite(right_inputs[0]);
    right_neg.pwmWrite(right_inputs[1]);
};

function pwmValue(input){
    positive = calculatePWM(input);
    if (input >= 0){
        negative = 0;
    } else {
        negative = calculatePWM(input);
    }
    return [positive, negative];
};

function calculatePWM(input) {
    return Math.abs(Math.round((input/100)*255));
}

// function calculateInput(percentage){
//     if (percentage === 0 ){
//         return [0,0]
//     } else if (percentage > 0){
//         return [pwmValue(percentage), pwmValue(percentage)]

//         console.log(percentage);
//     } else if (percentage < 0){
//         console.log(percentage)
//     };
// };