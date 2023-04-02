const Gpio = require('pigpio').Gpio;
let intervalId;
const led = new Gpio(17, {mode: Gpio.OUTPUT});
controlLED("flashing");
const left_pos = new Gpio(13, {mode: Gpio.OUTPUT});
const left_neg = new Gpio(19, {mode: Gpio.OUTPUT});
const right_pos = new Gpio(18, {mode: Gpio.OUTPUT});
const right_neg = new Gpio(12, {mode: Gpio.OUTPUT});
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });
let isConnected = false;
let clientTimeoutId;

console.log("Waiting for connection");

// error handling
left_pos.on('error', (err) => console.error('left_pos error: ', err));
left_neg.on('error', (err) => console.error('left_neg error: ', err));
right_pos.on('error', (err) => console.error('right_pos error: ', err));
right_neg.on('error', (err) => console.error('right_neg error: ', err));

wss.on("connection", ws => {
  if (isConnected) {
    console.log("Connection refused. A client is already connected.");
    ws.terminate();
    return;
  }

  controlLED("on");
  isConnected = true;
  console.log("New client connected");

  ws.on("message", data => {
    let input = `${data}`;
    cleanInput = JSON.parse(input);
    driveMotors(cleanInput.left, cleanInput.right);
    // Reset the timeout timer whenever a message is received
    clearTimeout(clientTimeoutId);
    clientTimeoutId = setTimeout(() => {
      // The client has not sent a message for over 1 second
      // Do something here, for example:
      console.log("Client has timed out.");
      // Turn off the LED if there are no more connected clients
      controlLED("off");
      isConnected = false;
      driveMotors(0, 0);
      ws.terminate();
    }, 1000);
  });

  ws.on("close", () => {
    console.log("Client has disconnected");
    controlLED("off");
    isConnected = false;
    driveMotors(0, 0);
  });
});


function driveMotors(left,right){

    left_inputs = pwmValue(left);
    right_inputs = pwmValue(right);
    console.log(pwmValue(left) + '    '+ pwmValue(right));
    // error handling
    try {
        left_pos.pwmWrite(left_inputs[0]);
        left_neg.pwmWrite(left_inputs[1]);
        right_pos.pwmWrite(right_inputs[0]);
        right_neg.pwmWrite(right_inputs[1]);
    } catch (err) {
        console.error('Error while writing to GPIO pins: ', err);
    }
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

function controlLED(mode) {
  // Clear any previous intervals
  clearInterval(intervalId);

  if (mode === "off") {
    // Turn off the LED
    led.digitalWrite(0);
  } else if (mode === "flashing") {
    // Pulse the LED every second
    let isOn = false;
    intervalId = setInterval(() => {
      isOn = !isOn;
      led.digitalWrite(isOn ? 1 : 0);
    }, 1000);
  } else if (mode === "on") {
    // Turn on the LED
    led.digitalWrite(1);
  }
}

// Function to handle the interrupt signal and turn off the LED
function handleInterrupt() {
  clearInterval(intervalId);
  led.digitalWrite(0);
  left_pos.pwmWrite(0);
  left_neg.pwmWrite(0);
  right_pos.pwmWrite(0);
  right_neg.pwmWrite(0);
  process.exit();
}

// Register the interrupt signal handler
process.on('SIGINT', handleInterrupt);