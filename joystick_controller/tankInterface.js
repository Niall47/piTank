var joyParam = {
    "title": "joystick",
    "width": 300,
    "height": 300
};
var connectionStatusBar = document.getElementById('connectionStatusBar');
let refreshRateText = document.getElementById("refreshRateText");
const status = document.getElementById("status");
direction = document.getElementById("direction");
customInput = document.getElementById("customIP");
customPort  = document.getElementById("customPort");
connectButton = document.getElementById("connectButton");
driveValues = document.getElementById("driveValues");
var algorithm = getSteeringAlgorithm();
logContent = document.getElementById("logContent");
Joy = new JoyStick('joyDiv', joyParam);


openTab('connectTab');
updateDisplay('Disconnected');
let intervalID;
const refreshRate = document.getElementById("refreshRate");
startInterval();


function customConnect() {
    updateDisplay('scanning');
    sendLog('Connecting to ' + customInput.value + ':' + customPort.value);
    connect(customInput.value, customPort.value);
};

function sendLog(message) {
    logContent.innerHTML += message + '<br>';
    logContent.scrollTop = logContent.scrollHeight;
};

function updateDisplay(status) {
    if (status === 'Disconnected') {
        console.log('setting status to Disconnected');
        connectionStatusBar.style.backgroundColor = 'grey';
        connectionStatusBar.innerHTML = 'Disconnected';
        connectionStatusBar.disabled = true;
        connectButton.disabled = false;
        connectButton.onclick = function() { connect(customInput.value, customPort.value); };
        connectionStatusBar.disabled = true;
        scanButton.disabled = false;
        scanButton.onclick = scan;
        connectionStatusBar.onclick = null;
    } else if (status === 'Scanning') {
        console.log('setting status to Scanning');
        connectionStatusBar.style.backgroundColor = 'red';
        connectionStatusBar.innerHTML = 'Stop scan';
        connectButton.disabled = true;
        connectionStatusBar.disabled = false;
        scanButton.disabled = true;
        connectionStatusBar.onclick = stopScan;
    } else if (status === 'Queued'){
        console.log('setting status to Queued');
        connectionStatusBar.style.backgroundColor = 'orange';
        connectionStatusBar.innerHTML = 'Leave queue';
        connectionStatusBar.onclick = disconnect;
        connectionStatusBar.disabled = false;
        connectButton.disabled = true;
        scanButton.disabled = true;
        connectionStatusBar.onclick = disconnect;
        openTab('connectTab');
    } else if (status === 'Connected') {
        console.log('setting status to Connected');
        connectionStatusBar.style.backgroundColor = 'red';
        connectionStatusBar.innerHTML = 'Disconnect';
        connectionStatusBar.onclick = disconnect;
        connectionStatusBar.disabled = false;
        connectButton.disabled = true;
        scanButton.disabled = true;
        openTab('driveTab');
    }
    else {
        console.log('Unknown status: ' + status);
    }
};



function manualConnect() {
    if (connectionStatus === false) {
        updateDisplay('scanning');
        connect(customInput.value, customPort.value); 
    } else {
        disconnect();
    }
};

function changeSteeringAlgorithm() {
    algorithm = getSteeringAlgorithm();
    console.log("Changed to " + algorithm);
};

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
    joyX = Joy.GetX();
    joyY = Joy.GetY();
    return {
        X: joyX,
        Y: joyY
    };
};

function sendPayload(payload) {
    console.log('sending: ' + payload)
    socket.send(payload)
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

function rateUpdate() {
    clearInterval(intervalID); // Clear any existing interval
    startInterval();
}

function startInterval() {
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