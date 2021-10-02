const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", ws => {
    console.log("New client connected");

    ws.on("message", data => {
        let input = `${data}`;
        switch( input ) {
            case 'C':
                console.log("Idle");
                break;
            case 'N':
                console.log('Forward');
                break;
            case 'NE':
                console.log('Forward/Right');
                break;
            case 'E':
                console.log('Right');
                break;
            case 'SE':
                console.log('Backward/Right');
                break;
            case 'S':
                console.log('Backward');
                break;
            case 'SW':
                console.log('Backward/Left');
                break;
            case 'W':
                console.log('Left');
                break;
            case 'NW':
                console.log('Forward/Left');
                break;
            case 'X':
                console.log('Shutdown');
                break;
            case 'R':
                console.log('Restart');
                break;
            default:
                console.log(input);
        }
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
    });
});