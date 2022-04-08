var joyParam = { "title": "joystick",
                "width": 300,
                "height": 300 };
var connectionStatus = false;
let refreshRate = document.getElementById("refreshRate");
let refreshRateText = document.getElementById("refreshRateText");
connectionBlock = document.getElementById("connectionBlock");
const status = document.getElementById("status");
direction = document.getElementById("direction");
customInput = document.getElementById("customIP");
connectButton = document.getElementById("connectButton");
driveValues = document.getElementById("driveValues");
var algorithm = getSteeringAlgorithm();
rateUpdate();
Joy = new JoyStick('joyDiv', joyParam);
Vis = new Visualiser('visualiserDiv', {})

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
    1 == connectionStatus ? connectionBlock.style.visibility = 'hidden' : connectionBlock.style.visibility = 'visbible'
};

function compass() {
    left = "COMPASS PLACEHOLDER";
    right = "COMPASS PLACEHOLDER"
    return {left, right};
};

function vanilla(x,y) {
    r = Math.hypot(x,y);
    t = Math.atan2(y,x);

    t += Math.PI / 4;

    left = r * Math.cos(t);
    right = r * Math.sin(t);

    left = left * Math.sqrt(2);
    right = right * Math.sqrt(2);

    // left = Math.max(-100, Math.min(left, 100));
    // right = Math.max(-100, Math.min(right, 100));

    return {left, right};
};

function experimental(){
    left = "EXPERIMENTAL PLACEHOLDER";
    right = "EXPERIMENTAL PLACEHOLDER"
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
        case "vanilla":
            return vanilla(x,y);
        case "experimental":
            return experimental(x,y);
    }
};

setInterval(function() {
    joyX = Joy.GetX();
    joyY = Joy.GetY();
    payload = {X: joyX, Y: joyY};
    driveValues.innerHTML = JSON.stringify(getMotorInputs(joyX, joyY));
    direction.innerHTML = JSON.stringify(payload), 
    1 == connectionStatus && ws.send(JSON.stringify(payload));
    }, parseInt(refreshRate.value)), 
    connect("localhost"), updateDisplay();


