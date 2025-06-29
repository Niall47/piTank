const disconnectButton = document.getElementById('disconnectButton');
const scanButton = document.getElementById('scanButton');
const stopScanButton = document.getElementById('stopScanButton');
let connectionStatus = 'Disconnected';
let piTankIP = null;
let socket;
let scanning = false;
let scanSockets = [];
const defaultPort = '8081';
const baseIp = '192.168.0.';

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
            console.log('Connected to:', ip);
            socket = ws;
            if (scanning)
                {scanning = false;
                scanSockets.forEach(s => {
                    if (s !== ws) s.close();
                });
                scanSockets = [ws];}
                else { ws.close(); reject(); }
                resolve({ip, ws})
        };
        ws.onerror = () => { ws.close(); reject(); };
        ws.onclose = () => { reject(); };
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
}

function stopScan() {
    if (!scanning) return;
    scanning = false;
    scanSockets.forEach(s => s.close());
    scanSockets = [];
    connectionStatus = 'Disconnected';
    sendLog('Scan stopped');
    updateDisplay(connectionStatus);
};
