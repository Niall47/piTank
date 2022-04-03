var joyParam = { "title": "joystick",
                "width": 300,
                "height": 300 };
var Joy = new JoyStick('joyDiv', joyParam);
var connectionStatus = false;
refreshRate = document.getElementById("refreshRate");
refreshRateText = document.getElementById("refreshRateText");
connectionBlock = document.getElementById("connectionBlock");
const status = document.getElementById("status"),
direction = document.getElementById("direction"),
customInput = document.getElementById("customIP"),
connectButton = document.getElementById("connectButton")
rateUpdate();

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
    1 == connectionStatus ? connectBlock.style.visibility = 'hidden' : connectBlock.style.visibility = 'visbible'
};

setInterval(function() {
payload = {
            X: Joy.GetX(),
            Y: Joy.GetY()
};

direction.innerHTML = JSON.stringify(payload), 
1 == connectionStatus && ws.send(JSON.stringify(payload));
}, parseInt(refreshRate.value)), 
connect("localhost"), updateDisplay();