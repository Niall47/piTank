var sys = require('sys');
var exec = require('child_process').exec;
var Gpio = require('onoff').Gpio;
var LED = new Gpio(23, 'out'),
DC4 = new Gpio(4, 'out'),
DC17 = new Gpio(17, 'out'),
DC27 = new Gpio(27, 'out'),
DC22 = new Gpio(22, 'out');
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });

// Create shutdown function
function shellCommand(command="", callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
}


wss.on("connection", ws => {
    console.log("New client connected");
    LED.writeSync(1);

    ws.on("message", data => {
        let input = `${data}`;
        switch( input ) {
            case 'C':
                console.log("Idle");
                idle();
                break;
            case 'N':
                console.log('Forward');
                forward();
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
        LED.writeSync(0);
    });

});

function idle (){
    DC4.writeSync(0);
    DC17.writeSync(0);
    DC22.writeSync(0);
    DC27.writeSync(0);
}
function forward() {
    DC4.writeSync(1);
    DC17.writeSync(1);
    DC27.writeSync(0);
    DC22.writeSync(1);
};