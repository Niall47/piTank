const Gpio = require('pigpio').Gpio;
let intervalId;
const led = new Gpio(17, {mode: Gpio.OUTPUT});
controlLED("flashing");
const right_pos = new Gpio(13, {mode: Gpio.OUTPUT});
const right_neg = new Gpio(19, {mode: Gpio.OUTPUT});
const left_pos = new Gpio(18, {mode: Gpio.OUTPUT});
const left_neg = new Gpio(12, {mode: Gpio.OUTPUT});
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });
let isConnected = false;
let clientTimeoutId;
let connectionQueue = [];
let currentClient = null;

console.log("Waiting for connection");

// error handling
left_pos.on('error', (err) => console.error('left_pos error: ', err));  
left_neg.on('error', (err) => console.error('left_neg error: ', err));  
right_pos.on('error', (err) => console.error('right_pos error: ', err));
right_neg.on('error', (err) => console.error('right_neg error: ', err));

let lastLeft = null, lastRight = null;
let lastMsgTime = 0, droppedMsgs = 0;
const MIN_MSG_INTERVAL = 100; // ms between processing messages

// heartbeat support
const HEARTBEAT_INTERVAL = 30000;
wss.on("connection", (ws, req) => {
   // capture and log client identity from handshake
   const ua = req.headers['user-agent'] || 'Unknown';
   console.log(`Client connected from ${req.socket.remoteAddress}:${req.socket.remotePort}`);
   console.log(` → User-Agent: ${ua}`);
   console.log(" → Handshake headers:", req.headers);
    ws.isAlive = true;
    ws.on("pong", () => ws.isAlive = true);
    console.log(`Incoming connection (${connectionQueue.length + (isConnected?1:0)} in queue)`);
    if (!isConnected) {
        acceptClient(ws);
    } else {
        connectionQueue.push(ws);
        ws.send(JSON.stringify({ status: "queued", position: connectionQueue.length }));
        if (currentClient) currentClient.send(JSON.stringify({ status:"queue_update", position: connectionQueue.length }));
        ws.on("close", () => {
            connectionQueue = connectionQueue.filter(c => c !== ws);    
            if (currentClient) currentClient.send(JSON.stringify({ status:"queue_update", position: connectionQueue.length }));
        });
    }
});

// periodically ping clients and terminate if no pong
setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) {
      console.warn("Terminating unresponsive client");
      ws.terminate();
    } else {
      ws.isAlive = false;
      ws.ping();
    }
  });
}, HEARTBEAT_INTERVAL);

function acceptClient(ws) {
    controlLED("on");
    isConnected = true;
    currentClient = ws;
    console.log("New client connected");
    ws.send(JSON.stringify({ status: "connected" }));
    let clientTimeoutId;

    ws.on("message", data => {
        // always clear previous timeout to avoid spurious disconnects  
        clearTimeout(clientTimeoutId);

        const now = Date.now();
        if (now - lastMsgTime < MIN_MSG_INTERVAL) {
            droppedMsgs++;
            console.warn(`Dropped old msg #${droppedMsgs}, Δ=${now - lastMsgTime}ms`);
        } else {
            lastMsgTime = now;
            let { left, right } = JSON.parse(data);
            driveMotors(left, right);
        }

        // schedule next timeout check
        clientTimeoutId = setTimeout(() => {
            console.error("Client timeout – no messages for 2s");       
            ws.terminate();
        }, 2000);
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
        currentClient = null;
        shutdownCurrent();
        if (connectionQueue.length > 0) {
            const next = connectionQueue.shift();
            acceptClient(next);
        }
    });
}

function driveMotors(left, right) {
    const left_inputs  = pwmValue(left);
    const right_inputs = pwmValue(right);
    // only log when inputs change
    if (left !== lastLeft || right !== lastRight) {
        console.log(`Drive command: L=${left}, R=${right}`);
        lastLeft = left; lastRight = right;
    }
    try {
        left_pos.pwmWrite(left_inputs[0]);
        left_neg.pwmWrite(left_inputs[1]);
        right_pos.pwmWrite(right_inputs[0]);
        right_neg.pwmWrite(right_inputs[1]);
    } catch (err) {
        console.error('GPIO write error:', err);
    }
}

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
    }, 500);
  } else if (mode === "on") {
    // Turn on the LED
    led.digitalWrite(1);
  }
}

// Function to handle the interrupt signal and turn off the LED
function handleInterrupt() {
  shutdown();
  process.exit();
}

function shutdown() {
  console.log("Shutting down");
  clearInterval(intervalId);
  controlLED("off");
  left_pos.pwmWrite(0);
  left_neg.pwmWrite(0);
  right_pos.pwmWrite(0);
  right_neg.pwmWrite(0);
}

function shutdownCurrent() {
    isConnected = false;
    controlLED("off");
    driveMotors(0, 0);
}

// Register the interrupt signal handler
process.on('SIGINT', handleInterrupt);