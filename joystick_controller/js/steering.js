// Global variables for backward compatibility
var algorithm = 'diffsteer';
var intervalID = null;
var Joy = null;

function changeSteeringAlgorithm() {
    if (joystickHandler) {
        joystickHandler.updateFromRadioButton();
    } else {
        algorithm = getSteeringAlgorithm();
        sendLog("Changed to " + algorithm);
    }
}

function rateUpdate() {
    if (joystickHandler) {
        joystickHandler.updateRefreshRate();
    } else {
        clearInterval(intervalID);
        startInterval();
    }
}

function startInterval() {
    if (joystickHandler) {
        joystickHandler.startInterval();
        return;
    }
    
    intervalID = setInterval(function() {
        let directions = getDirection();
        motorInputs = getMotorInputs(directions.X, directions.Y);
        motorInputPayload = JSON.stringify(motorInputs);
        driveValues.innerHTML = motorInputPayload;
        direction.innerHTML = JSON.stringify(directions);
        if (connectionStatus === 'Connected') {
            sendPayload(motorInputPayload);
        }
        updateCanvas(motorInputs.right, 'rightTrack');
        updateCanvas(motorInputs.left, 'leftTrack');
    }, parseInt(refreshRate.value));
    refreshRateText.textContent = `Refresh rate: ${refreshRate.value} ms`;
}

function getSteeringAlgorithm() {
    return document.querySelector('input[name="algorithm"]:checked').id;
};

function getMotorInputs(x, y) {
    switch (algorithm) {
        case "compass":
            return compass(x, y);
        case "diffsteer":
            return diffSteer(x, y);
        case "experimental":
            return experimental(x, y);
    }
};

function getDirection() {
    if (Joy) {
        joyX = Joy.GetX();
        joyY = Joy.GetY();
        return {
            X: joyX,
            Y: joyY
        };
    }
    return { X: 0, Y: 0 };
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
    return {
        left,
        right
    };
};

function diffSteer(leftRightAxis, upDownAxis) {
    axisFlip = -1;
    maxAxis = 1;
    maxSpeed = 100; // Set maxSpeed to 100 to represent percentages
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
    // Invert the Y-axis
    upDownAxis = -upDownAxis / 100;
    // Calculate Throttled Steering Motor values
    direction = leftRightAxis / maxAxis;
    // Turn with throttle
    leftMotorScale = upDownAxis * (1 + direction);
    leftMotorScale = clamp(leftMotorScale, minAxis, maxAxis); // Govern Axis to Minimum and Maximum range
    rightMotorScale = upDownAxis * (1 - direction);
    rightMotorScale = clamp(rightMotorScale, minAxis, maxAxis); // Govern Axis to Minimum and Maximum range
    // Calculate No Throttle Steering Motors values (Turn with little to no throttle)
    throttle = 1 - Math.abs(upDownAxis / maxAxis); // Throttle inverse magnitude (1 = min, 0 = max)
    leftMotorNoThrottleScale = -leftRightAxis * throttle;
    rightMotorNoThrottleTurnScale = leftRightAxis * throttle;
    // Calculate final motor output values, scale to -100 to 100
    leftMotorOutput = Math.round((leftMotorScale + leftMotorNoThrottleScale) * axisFlip * maxSpeed);
    leftMotorOutput = clamp(leftMotorOutput, -maxSpeed, maxSpeed);
    rightMotorOutput = Math.round((rightMotorScale + rightMotorNoThrottleTurnScale) * axisFlip * maxSpeed);
    rightMotorOutput = clamp(rightMotorOutput, -maxSpeed, maxSpeed);
    return {
        left: leftMotorOutput,
        right: rightMotorOutput
    };
}

function experimental(x, y) {
    // Define deadzone for joystick
    const deadzone = 15;
    // Check if joystick is not all the way forward or all the way back
    if (y > -99 && y < 99) {
        // Check if joystick is within deadzone
        if (Math.abs(x) < deadzone && Math.abs(y) < deadzone) {
            return {
                left: 0,
                right: 0
            };
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
            return {
                left: -Math.floor(leftSpeed),
                right: -Math.floor(rightSpeed)
            };
        } else {
            return {
                left: Math.floor(leftSpeed),
                right: Math.floor(rightSpeed)
            };
        }
    } else {
        // Joystick is all the way forward or all the way back
        // Send maximum speed to both tracks in the appropriate direction
        if (y < 0) {
            return {
                left: -100,
                right: -100
            };
        } else {
            return {
                left: 100,
                right: 100
            };
        }
    }
};
