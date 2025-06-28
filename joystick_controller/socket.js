const disconnectButton = document.getElementById('disconnectButton');
const scanButton = document.getElementById('scanButton');
const stopScanButton = document.getElementById('stopScanButton');
let connectionStatus = 'Disconnected';
let piTankIP = null;
let socket;



function disconnect() {
    if (connectionStatus === 'Connected' 
        || connectionStatus === 'Queued'
    ) {
        console.log('Disconnecting from ip:', customInput.value, 'Port:', customPort.value   );
        connectionStatus = 'Disconnected';
        updateDisplay(connectionStatus);
        socket.close();
    }
};

function connect(ip = '192.168.0.20', port = '8081') {
    if (connectionStatus === 'Disconnected' || connectionStatus === 'Scanning') {
        socket = new WebSocket(`ws://${ip}:${port}`);

        socket.onopen = function() {
            connectionStatus = 'Connected';
            piTankIP = ip + ':' + port;
            sendLog('Connected to ' + ip + ':' + port);
            updateDisplay(connectionStatus);
        };

        socket.onclose = function() {
            connectionStatus = 'Disconnected';
            sendLog('Disconnected from ' + ip + ':' + port);
            updateDisplay(connectionStatus);
        };

        socket.onerror = function(error) {
            console.error('WebSocket error:', error);
        };

        socket.onmessage = function(event) {
            console.log('Message from server:', event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.status === 'queued') {
                    connectionStatus = 'Queued';
                    sendLog('Queued—position: ' + data.position);
                    updateDisplay(connectionStatus);
                } else if (data.status === 'queue_update') {
                    sendLog('Queue update—new position: ' + data.position); 
                }else if (data.status === 'connected') {
                    connectionStatus = 'Connected';
                    sendLog('Server says connected');
                    updateDisplay(connectionStatus);
                } else if (data.status === 'disconnected') {
                    connectionStatus = 'Disconnected';
                    sendLog('Server disconnected'); 
                    updateDisplay(connectionStatus);                
                } else {
                    console.log('Unknown JSON message from server:', event.data);
                }
            } catch (e) {
                if (event.data === 'connected') {
                    connectionStatus = 'Connected';
                    console.log('Connected to ip:', data.ip, 'Port:', data.port);
                    console.log('Status: ', event.data);
                    updateDisplay(connectionStatus);
                }
                else if (event.data === 'disconnected') {
                    connectionStatus = 'Disconnected';
                    console.log('Disconnected from :', ip, 'Port:', port);
                    updateDisplay(connectionStatus);
                }
                else {
                    console.log('Unknown message from server:', event.data);
                }
            }
        };
    }

};

let scanning = false;
let scanSockets = [];
const defaultPort = '8081';
const baseIp = '192.168.0.';

function scan(targetIp = null, targetPort = null) {
    if (connectionStatus !== 'Disconnected') return;
    
    if (targetIp && targetPort) {
        sendLog(`Connecting to ${targetIp}:${targetPort}...`);
    } else {
        sendLog('Starting network scan...');
    }
    
    scanning = true;
    connectionStatus = 'Scanning';
    updateDisplay(connectionStatus);
    
    const ips = targetIp && targetPort
        ? [`ws://${targetIp}:${targetPort}`]
        : Array.from({length: 254}, (_, i) => `ws://${baseIp}${i + 1}:${defaultPort}`);
    
    console.log('Scanning IPs:', ips);
    
    const connectPromises = ips.map(ip => new Promise((resolve, reject) => {
        if (!scanning) return reject();
        const ws = new WebSocket(ip);
        scanSockets.push(ws);
        ws.onopen = () => {
            socket = ws;
            if (scanning) resolve({ip, ws});
            else { ws.close(); reject(); }
        };
        ws.onerror = () => { ws.close(); reject(); };
        ws.onclose = () => { reject(); };
        
        // Add message handling from connect function
        ws.onmessage = function(event) {
            console.log('Message from server:', event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.status === 'queued') {
                    connectionStatus = 'Queued';
                    sendLog('Queued—position: ' + data.position);
                    updateDisplay(connectionStatus);
                } else if (data.status === 'queue_update') {
                    sendLog('Queue update—new position: ' + data.position); 
                }else if (data.status === 'connected') {
                    connectionStatus = 'Connected';
                    sendLog('Server says connected');
                    updateDisplay(connectionStatus);
                } else if (data.status === 'disconnected') {
                    connectionStatus = 'Disconnected';
                    sendLog('Server disconnected'); 
                    updateDisplay(connectionStatus);                
                } else {
                    console.log('Unknown JSON message from server:', event.data);
                }
            } catch (e) {
                if (event.data === 'connected') {
                    connectionStatus = 'Connected';
                    console.log('Connected to ip:', event.data);
                    console.log('Status: ', event.data);
                    updateDisplay(connectionStatus);
                }
                else if (event.data === 'disconnected') {
                    connectionStatus = 'Disconnected';
                    console.log('Disconnected from:', ip);
                    updateDisplay(connectionStatus);
                }
                else {
                    console.log('Unknown message from server:', event.data);
                }
            }
        };
    }));

    Promise.any(connectPromises)
        .then(({ip, ws}) => {
            sendLog('Found host at ' + ip);
            scanning = false;
            scanSockets.forEach(s => s !== ws && s.close());
            scanSockets = [];
            socket = ws;
            connectionStatus = 'Connected';
            customIPut.value = ip;
            customPort.value = defaultPort;
            sendLog('Connected to ' + ip + ':' + defaultPort);
            updateDisplay(connectionStatus);
        })
        .catch(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {

                connectionStatus = 'Connected';
                sendLog('Connected to ' + piTankIP);
            } else {
                connectionStatus = 'Disconnected';
                sendLog('No hosts found');
                scanSockets.forEach(s => s.close());
                scanSockets = [];
                scanning = false;
                connectionStatus = 'Disconnected';
            }
            updateDisplay(connectionStatus);
        });
}

function stopScan() {
    if (!scanning) return;
    scanning = false;
    scanSockets.forEach(s => s.close());
    scanSockets = [];
    connectionStatus = 'Disconnected';
    sendLog('Scan stopped');
    updateDisplay(connectionStatus);
}


