
var joyParam = { "title": "joystick",
                "width": 300,
                "height": 300 };
var connectionStatus = false;
let refreshRate = document.getElementById("refreshRate");
let refreshRateText = document.getElementById("refreshRateText");
connectedBlock = document.getElementById("connectedBlock");
disconnectedBlock = document.getElementById("disconnectedBlock");
const status = document.getElementById("status");
direction = document.getElementById("direction");
customInput = document.getElementById("customIP");
connectButton = document.getElementById("connectButton");
driveValues = document.getElementById("driveValues");
var algorithm = getSteeringAlgorithm();
rateUpdate();
Joy = new JoyStick('joyDiv', joyParam);
// Vis = new Visualiser('visualiserDiv', {})

function connect(t) {

    var url = `ws://${customInput.value}:${customPort.value}`;
    console.log(`Trying to connect to ${url}`)
    try {
        ws = new WebSocket(`${url}`), ws.addEventListener("open", () => {
        connectionStatus = !0, console.log("We are connected"), updateDisplay()
        }), ws.addEventListener("close", () => {
        connectionStatus = !1, console.log("We were disconnected"), updateDisplay()
        })
    } catch {
        console.log("Couldn't connect to " + url)
    }
};

function rateUpdate(){
    refreshRateText.textContent = "Refresh rate (ms): " + refreshRate.value;
}

function customConnect() {
    connect(customInput.value)
};

function updateDisplay() {
    if (connectionStatus === true) {
        connectedBlock.style.visibility = 'visible'
        disconnectedBlock.style.visibility = 'hidden'
    } else {
        connectedBlock.style.visibility = 'hidden'
        disconnectedBlock.style.visibility = 'visible'
    }
};

 function disconnect() {
    connectionStatus = false
    ws.close()
    updateDisplay()
 };

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
 };

function compass() {
    left = "COMPASS PLACEHOLDER";
    right = "COMPASS PLACEHOLDER"
    return {left, right};
};

function diffSteer(leftRightAxis, upDownAxis) {
    // console.log(leftRightAxis);
    // console.log(upDownAxis);
    axisFlip = -1;
    maxAxis = 1;
    maxSpeed = 255;
    minAxis = -1;
    var direction = 0;
    var leftMotorNoThrottleScale = 0;
    var leftMotorOutput = 0;
    var leftMotorScale = 0;
    var rightMotorNoThrottleTurnScale = 0;
    var rightMotorOutput = 0;
    var rightMotorScale = 0;
    var throttle;
  
    // Adjust for the joystick being used
    leftRightAxis = leftRightAxis / 100;
    upDownAxis = upDownAxis / 100;


    // Calculate Throttled Steering Motor values
    direction = leftRightAxis / maxAxis;
  
    // Turn with with throttle
    leftMotorScale = upDownAxis * (1 + direction);
    leftMotorScale = clamp(leftMotorScale, minAxis, maxAxis); // Govern Axis to Minimum and Maximum range
    rightMotorScale = upDownAxis * (1 - direction);
    rightMotorScale = clamp(rightMotorScale, minAxis, maxAxis); // Govern Axis to Minimum and Maximum range
  
    // Calculate No Throttle Steering Motors values (Turn with little to no throttle)
    throttle = 1 - Math.abs(upDownAxis / maxAxis); // Throttle inverse magnitude (1 = min, 0 = max)
    leftMotorNoThrottleScale = -leftRightAxis * throttle;
    rightMotorNoThrottleTurnScale = leftRightAxis * throttle;
  
    // Calculate final motor output values
    leftMotorOutput = (leftMotorScale + leftMotorNoThrottleScale) * axisFlip;
    leftMotorOutput = clamp(leftMotorOutput, minAxis, maxAxis);
    rightMotorOutput = (rightMotorScale + rightMotorNoThrottleTurnScale) * axisFlip;
    rightMotorOutput = clamp(rightMotorOutput, minAxis, maxAxis);
    left = maxSpeed * leftMotorOutput;
    right = maxSpeed * rightMotorOutput;

    return {left, right};
  }

function experimental(x,y){
    r = Math.hypot(x,y);
    t = Math.atan2(y,x);

    t += Math.PI / 4;

    left = r * Math.cos(t);
    right = r * Math.sin(t);

    left = left * Math.sqrt(2);
    right = right * Math.sqrt(2);

    // left = Math.max(-100, Math.min(left, 100));
    // right = Math.max(-100, Math.min(right, 100));
    left = Math.round(left);
    right = Math.round(right);
    return {left, right};
};

function changeSteeringAlgorithm() {
    algorithm = getSteeringAlgorithm();
    console.log("Changed to " + algorithm);
};

function getSteeringAlgorithm() {
    return document.querySelector('input[name="algorithm"]:checked').id;
};

function getMotorInputs(x,y){
    switch (algorithm) {
        case "compass":
            return compass(x,y);
        case "diffsteer":
            return diffSteer(x,y);
        case "experimental":
            return experimental(x,y);
    }
};

function getDirection() {
    joyX = Joy.GetX();
    joyY = Joy.GetY();
    return {X: joyX, Y: joyY};
};

function sendPayload(payload) {
    console.log('sending: ' + payload)
    ws.send(payload)
};


setInterval(function() {
    let directions = getDirection()
    motorInputs = getMotorInputs(directions.Y, directions.Y);
    motorInputPayload = JSON.stringify(motorInputs);
    driveValues.innerHTML = motorInputPayload
    direction.innerHTML = JSON.stringify(directions);
    updateCanvas(motorInputs.right, 'rightTrack');
    updateCanvas(motorInputs.left, 'leftTrack');
      }, parseInt(refreshRate.value)), 
     updateDisplay();