
var joyParam = { "title": "joystick",
                "width": 300,
                "height": 300 };
var connectionStatus = false;
var connectTabButton = document.getElementById('connectTabButton');
let refreshRate = document.getElementById("refreshRate");
let refreshRateText = document.getElementById("refreshRateText");
const status = document.getElementById("status");
direction = document.getElementById("direction");
customInput = document.getElementById("customIP");
connectButton = document.getElementById("connectButton");
driveValues = document.getElementById("driveValues");
var algorithm = getSteeringAlgorithm();
rateUpdate();
Joy = new JoyStick('joyDiv', joyParam);

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
        connectTabButton.style.backgroundColor = 'green';
    } else {
        connectTabButton.style.backgroundColor = 'red';
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

function compass(x, y) {

    direction = Joy.GetDir();
    var powerValues = {
        C: [0, 0],
        N: [100, 100],
        NE: [75, -75],
        E: [100, -100],
        SE: [-50, 50],
        S: [-100, -100],
        SW: [50, -50],
        W: [-100, 100],
        NW: [-75, 75]
      };
    left = powerValues[direction][0];
    right = powerValues[direction][1];
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
    left = -(maxSpeed * leftMotorOutput);
    right = -(maxSpeed * rightMotorOutput);

    return {left, right};
  }

function experimental(x, y) {
    // Define deadzone for joystick
    const deadzone = 15;
  
    // Check if joystick is not all the way forward or all the way back
    if (y > -99 && y < 99) {
      // Check if joystick is within deadzone
      if (Math.abs(x) < deadzone && Math.abs(y) < deadzone) {
        return { left: 0, right: 0 };
      }
  
      // Map x-axis value to left/right speed difference
      const speedDiff = x * 0.5; // Scale input to appropriate range
  
      // Map y-axis value to overall speed
      const speed = Math.abs(y) * 0.5; // Scale input to appropriate range
  
      // Combine values to determine final speed of each track
      let leftSpeed, rightSpeed;
      if (speedDiff > 0) {
        leftSpeed = speed;
        rightSpeed = speed - speedDiff;
      } else {
        leftSpeed = speed + speedDiff;
        rightSpeed = speed;
      }
  
      // Adjust polarity of speed values based on y-axis direction
      if (y < 0) {
        return { left: -leftSpeed, right: -rightSpeed };
      } else {
        return { left: leftSpeed, right: rightSpeed };
      }
    } else {
      // Joystick is all the way forward or all the way back
      // Send maximum speed to both tracks in the appropriate direction
      if (y < 0) {
        return { left: -100, right: -100 };
      } else {
        return { left: 100, right: 100 };
      }
    }
  }

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

function openTab(tabName) {
    var tabContent = document.getElementsByClassName('tabContent');
    var tabButtons = document.getElementsByClassName('tabButton');

    for (var i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = 'none';
    }

    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
    }

    document.getElementById(tabName).style.display = 'block';
    document.querySelector('button[onclick="openTab(\'' + tabName + '\')"]').className += ' active';
}

// Initialize the default tab
openTab('driveTab');

setInterval(function() {
    let directions = getDirection()

    motorInputs = getMotorInputs(directions.X, directions.Y);
    motorInputPayload = JSON.stringify(motorInputs);
    driveValues.innerHTML = motorInputPayload
    direction.innerHTML = JSON.stringify(directions);

    if (connectionStatus === true) {
        sendPayload(motorInputPayload);
    };
    updateCanvas(motorInputs.right, 'rightTrack');
    updateCanvas(motorInputs.left, 'leftTrack');
      }, parseInt(refreshRate.value)),
     updateDisplay();