var sys = require('sys');
var exec = require('child_process').exec;
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

// Create shutdown function
function shellCommand(command="", callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
}

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
                shellCommand(command="shutdown now");
                break;
            case 'R':
                console.log('Restart');
                shellCommand(command="shutdown -r now");
                break;
            default:
                console.log(input);
        }
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
    });




});