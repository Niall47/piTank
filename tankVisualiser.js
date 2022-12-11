
function updateCanvas(value, track) {
    var canvas = document.getElementById(track);
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'red';

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