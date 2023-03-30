const Gpio = require('pigpio').Gpio;
const left_pos = new Gpio(13, {mode: Gpio.OUTPUT});
const left_neg = new Gpio(19, {mode: Gpio.OUTPUT});
const right_pos = new Gpio(18, {mode: Gpio.OUTPUT});
const right_neg = new Gpio(12, {mode: Gpio.OUTPUT});
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });
let isConnected = false;

console.log("Waiting for connection");
// pigpio.initialize(); 
wss.on("connection", ws => {
    if (isConnected) {
        console.log("Connection refused. A client is already connected.");
        ws.terminate();
        return;
    }

    isConnected = true;
    console.log("New client connected");

    ws.on("message", data => {
        let input = `${data}`;
        cleanInput = JSON.parse(input);
        driveMotors(cleanInput.left, cleanInput.right);
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
        driveMotors(0, 0);
        isConnected = false;
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
    console.log(`Left Pos: ${left_pos.digitalRead()}, Left Neg: ${left_neg.digitalRead()}, Right Pos: ${right_pos.digitalRead()}, Right Neg: ${right_neg.digitalRead()}`);
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
// ____   ____  ______   ____  ____   __  _ 
// |    \ l    j|      T /    T|    \ |  l/ ]
// |  o  ) |  T |      |Y  o  ||  _  Y|  ' / 
// |   _/  |  | l_j  l_j|     ||  |  ||    \ 
// |  |    |  |   |  |  |  _  ||  |  ||     Y
// |  |    j  l   |  |  |  |  ||  |  ||  .  |
// l__j   |____j  l__j  l__j__jl__j__jl__j\_j
                                          
