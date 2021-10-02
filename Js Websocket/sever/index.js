const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", ws => {
    console.log("New client connected");

    ws.on("message", data => {
        let input = `${data}`;
        console.log(`Client has sent: ${data}`);

        switch( input ) {
            case 'Forward':
                console.log('GPIO forward');
                break;
            case 'Back':
                console.log('GPIO back');
                break;
            case 'Left':
                console.log('GPIO Left');
                break;
            case 'Right':
                console.log('GPIO Right');
                break;
            default:
                console.log(input);
        }
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
    });
});