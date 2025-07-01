function customConnect() {
    updateDisplay('scanning');
    sendLog('Connecting to ' + customInput.value + ':' + customPort.value);
    connect(customInput.value, customPort.value);
}

function manualConnect() {
    if (connectionStatus === false) {
        updateDisplay('scanning');
        connect(customInput.value, customPort.value); 
    } else {
        disconnect();
    }
}

function sendPayload(payload) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn('Cannot send payload: socket not ready');
        return false;
    }
    
    try {
        socket.send(payload);
        return true;
    } catch (error) {
        console.error('Error sending payload:', error);
        return false;
    }
}
