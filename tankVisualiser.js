
var canvas = document.getElementById('powerVisualiser');
var context = canvas.getContext('2d');


context.fillStyle = 'red';

context.fillRect(0, 0, canvas.width, canvas.height);

function updateCanvas(value) {
var canvas = document.getElementById('powerVisualiser');
var context = canvas.getContext('2d');


context.clearRect(0, 0, canvas.width, canvas.height);

var rectX = 0;
var rectY = canvas.height / 2;
var rectWidth = canvas.width;
var rectHeight = value;

if (value > 0) {
    rectHeight = -rectHeight
} else if (value < 0) {
    rectHeight = -value;
} else {
    // Do nothing
}

context.fillRect(rectX, rectY, rectWidth, rectHeight);
};