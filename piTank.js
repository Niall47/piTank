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

    console.log(pwmValue(left) + '    '+ pwmValue(right))
    // left = calculateInput(left);
    // right = calculateInput(right);

    // left_pos.pwmWrite(left[0]);
    // left_neg.pwmWrite(left[1]);
    // right_pos.pw mWrite(right[0]);
    // right_neg.pwmWrite(right[1]);

    // console.log('Left: ' + pwmValue(left) +  '   Right: ' + pwmValue(right));
};

function pwmValue(input){
    positive = Math.round((input/100)*255);
    if (input >= 0){
        negative = 0;
    } else {
        negative = Math.round((input/100)*255);
    }
    negative = Math.round((input/100)*255);
    return [positive, negative];
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