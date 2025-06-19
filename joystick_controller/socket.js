
const disconnectButton = document.getElementById('disconnectButton');
const scanButton = document.getElementById('scanButton');
const stopScanButton = document.getElementById('stopScanButton');
let socket;



function disconnect() {
    if (connectionStatus === 'Connected' 
        || connectionStatus === 'Queued'
    ) {
        console.log('Disconnecting from WebSocket');
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
            updateDisplay(connectionStatus);
        };

        socket.onclose = function() {
            connectionStatus = 'Disconnected';
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
                    console.log('Connected to ip:', data.ip, 'Port:', data.port);
                    console.log('Status: ', data.status, 'Position in queue:', data.position);
                    updateDisplay(connectionStatus);
                } else if (data.status === 'queue_update') {
                    console.log('Queue update:', data.position);
                }else if (data.status === 'connected') {
                    connectionStatus = 'Connected';
                    console.log('Connected to ip:', data.ip, 'Port:', data.port);
                    console.log('Status: ', data.status);
                    updateDisplay(connectionStatus);
                } else if (data.status === 'disconnected') {
                    connectionStatus = 'Disconnected';
                    console.log('Disconnected from :', data.ip, 'Port:', data.port);
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

function scan() {
    if (connectionStatus !== 'Disconnected') return;
    scanning = true;
    connectionStatus = 'Scanning';
    updateDisplay(connectionStatus);

    const ips = Array.from({length:254}, (_,i)=> baseIp + (i+1));
    const connectPromises = ips.map(ip => new Promise((resolve, reject) => {
        if (!scanning) return reject();
        const ws = new WebSocket(`ws://${ip}:${defaultPort}`);
        scanSockets.push(ws);
        ws.onopen = () => {
            if (scanning) resolve({ip, ws});
            else { ws.close(); reject(); }
        };
        ws.onerror = () => { ws.close(); reject(); };
        ws.onclose = () => { reject(); };
    }));

    Promise.any(connectPromises)
        .then(({ip, ws}) => {
            scanning = false;
            scanSockets.forEach(s => s !== ws && s.close());
            scanSockets = [];
            socket = ws;
            connectionStatus = 'Connected';
            customIPut.value = ip;
            customPort.value = defaultPort;
            updateDisplay(connectionStatus);
        })
        .catch(() => {
            scanSockets.forEach(s => s.close());
            scanSockets = [];
            scanning = false;
            connectionStatus = 'Disconnected';
            updateDisplay(connectionStatus);
        });
}

function stopScan() {
    if (!scanning) return;
    scanning = false;
    scanSockets.forEach(s => s.close());
    scanSockets = [];
    connectionStatus = 'Disconnected';
    updateDisplay(connectionStatus);
}

let connectionStatus = 'Disconnected';
