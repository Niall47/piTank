var joyParam = {
    "title": "joystick",
    "width": 300,
    "height": 300
};


const status = document.getElementById("status");
customInput = document.getElementById("customIP");
customPort = document.getElementById("customPort");
connectButton = document.getElementById("connectButton");
logContent = document.getElementById("logContent");

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    openTab('connectTab');
    updateDisplay('Disconnected');
});

function customConnect() {
    updateDisplay('scanning');
    sendLog('Connecting to ' + customInput.value + ':' + customPort.value);
    connect(customInput.value, customPort.value);
}

function sendLog(message) {
    if (!message) return;
    
    try {
        logContent.innerHTML += message + '<br>';
        logContent.scrollTop = logContent.scrollHeight;
    } catch (error) {
        console.error('Error logging message:', error);
    }
}
