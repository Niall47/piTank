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

function sendLog(message) {
    if (!message) return;
    logContent.innerHTML += message + '<br>';
    logContent.scrollTop = logContent.scrollHeight;
};

function clearLogs() {
    logContent.innerHTML = '';
};

function updateDisplay(status) {
    if (status === 'Disconnected') {
        sendLog('setting status to Disconnected');
        disconnectButton.style.backgroundColor = 'grey';
        disconnectButton.innerHTML = 'Disconnected';
        disconnectButton.disabled = true;
        connectButton.disabled = false;
        connectButton.onclick = function() { scan(targetIp=customInput.value, targetPort=customPort.value); };
        disconnectButton.disabled = true;
        scanButton.disabled = false;
        scanButton.onclick = scan;
        disconnectButton.onclick = null;
        connectionBlock.style.display = 'block';
        disconnectButton.style.display = 'none';
        connectionStatusBar.innerHTML = 'Disconnected';
    } else if (status === 'Scanning') {
        sendLog('setting status to Scanning');
        disconnectButton.style.backgroundColor = 'red';
        disconnectButton.innerHTML = 'Stop scan';
        connectButton.disabled = true;
        disconnectButton.disabled = false;
        scanButton.disabled = true;
        disconnectButton.onclick = stopScan;
        connectButton.onclick = null;
        connectionBlock.style.display = 'none';
        disconnectButton.style.display = 'block';
        connectionStatusBar.innerHTML = 'Scanning...';
    } else if (status === 'Queued'){
        sendLog('setting status to Queued');
        disconnectButton.style.backgroundColor = 'orange';
        disconnectButton.innerHTML = 'Leave queue';
        disconnectButton.onclick = disconnect;
        disconnectButton.disabled = false;
        connectButton.disabled = true;
        scanButton.disabled = true;
        disconnectButton.onclick = disconnect;
        connectionBlock.style.display = 'none';
        disconnectButton.style.display = 'block';
        connectionStatusBar.innerHTML = 'Queued...';
        openTab('connectTab');
    } else if (status === 'Connected') {
        sendLog('setting status to Connected');
        disconnectButton.style.backgroundColor = 'red';
        disconnectButton.innerHTML = 'Disconnect';
        disconnectButton.onclick = disconnect;
        disconnectButton.disabled = false;
        connectionBlock.style.display = 'none';
        disconnectButton.style.display = 'block';
        connectButton.disabled = true;
        scanButton.disabled = true;
        const urlParts = socket.url.split('/');
        const hostPort = urlParts[2];
        const [ip, port] = hostPort.split(':');
        connectionStatusBar.innerHTML = 'Connected to ' + ip + ':' + port;
        customIP.value = ip;
        customPort.value = port ? port.replace(/\/$/, '') : '';
        customPort.value = socket.url.split(':')[2].replace(/\/$/, '');
        openTab('driveTab');
    }
    else {
        sendLog('Unknown status: ' + status);
    }
}
