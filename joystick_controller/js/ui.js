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
    logContent.innerHTML += message + '<br>';
    logContent.scrollTop = logContent.scrollHeight;
    console.log(message);
}

function updateDisplay(status) {
    if (status === 'Disconnected') {
        sendLog('setting status to Disconnected');
        connectionStatusBar.style.backgroundColor = 'grey';
        connectionStatusBar.innerHTML = 'Disconnected';
        connectionStatusBar.disabled = true;
        connectButton.disabled = false;
        connectButton.onclick = function() { scan(targetIp=customInput.value, targetPort=customPort.value); };
        connectionStatusBar.disabled = true;
        scanButton.disabled = false;
        scanButton.onclick = scan;
        connectionStatusBar.onclick = null;
    } else if (status === 'Scanning') {
        sendLog('setting status to Scanning');
        connectionStatusBar.style.backgroundColor = 'red';
        connectionStatusBar.innerHTML = 'Stop scan';
        connectButton.disabled = true;
        connectionStatusBar.disabled = false;
        scanButton.disabled = true;
        connectionStatusBar.onclick = stopScan;
    } else if (status === 'Queued'){
        sendLog('setting status to Queued');
        connectionStatusBar.style.backgroundColor = 'orange';
        connectionStatusBar.innerHTML = 'Leave queue';
        connectionStatusBar.onclick = disconnect;
        connectionStatusBar.disabled = false;
        connectButton.disabled = true;
        scanButton.disabled = true;
        connectionStatusBar.onclick = disconnect;
        openTab('connectTab');
    } else if (status === 'Connected') {
        sendLog('setting status to Connected');
        connectionStatusBar.style.backgroundColor = 'red';
        connectionStatusBar.innerHTML = 'Disconnect';
        connectionStatusBar.onclick = disconnect;
        connectionStatusBar.disabled = false;
        connectButton.disabled = true;
        scanButton.disabled = true;
        const urlParts = socket.url.split('/');
        const hostPort = urlParts[2];
        const [ip, port] = hostPort.split(':');
        customIP.value = ip;
        customPort.value = port ? port.replace(/\/$/, '') : '';
        customPort.value = socket.url.split(':')[2].replace(/\/$/, '');
        openTab('driveTab');
    }
    else {
        sendLog('Unknown status: ' + status);
    }
}
