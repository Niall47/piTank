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
rateUpdate();
Joy = new JoyStick('joyDiv', joyParam);

function connect(t) {

    var url = `ws://${customIP.value}:${customPort.value}`;
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

function convert(x,y) {
    r = Math.hypot(x,y);
    t = Math.atan2(y,x);

    t += Math.PI / 4;

    left = r * Math.cos(t);
    right = r * Math.sin(t);

    left = left * Math.sqrt(2);
    right = right * Math.sqrt(2);

    left = Math.max(-1, Math.min(left, 1));
    right = Math.max(-1, Math.min(right, 1));

    return {left, right};
};

setInterval(function() {
    joyX = Joy.GetX() / 10;
    joyY = Joy.GetY() / 10;

    payload = {X: joyX, Y: joyY};
    // console.log(payload);
    driveValues.innerHTML = JSON.stringify(convert(parseInt(joyX), parseInt(joyY)));
    direction.innerHTML = JSON.stringify(payload), 
    1 == connectionStatus && ws.send(JSON.stringify(payload));
    }, parseInt(refreshRate.value)), 
    connect("localhost"), updateDisplay();


