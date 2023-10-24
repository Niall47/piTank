function updateCanvas(value, track) {
    console.log("canvas being called")
    var canvas = document.getElementById(track);
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    var rectX = 0;
    var rectY = 0;
    var rectWidth = canvas.width;
    var rectHeight = value;

    var absValue = Math.abs(value);

    if (absValue <= 25) {
        var color = 'green';
    } else if (absValue <= 50) {
        var color = 'yellow';
    } else if (absValue <= 75) {
        var color = 'orange';
    } else {
        var color = 'red';
    }

    if (value < 0) {
        rectY = canvas.height / 2;
        rectHeight = -rectHeight;
        context.textBaseline = 'top';
    } else {
        rectY = canvas.height / 2 - rectHeight;
        context.textBaseline = 'bottom';
    }


    context.fillStyle = color;
    context.fillRect(rectX, rectY, rectWidth, rectHeight);

    context.fillStyle = 'white';
    context.font = 'bold 20px Arial';
    context.textAlign = 'center';

    // Add black outline to text
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    context.strokeText(value.toString(), canvas.width / 2, canvas.height / 2);
    context.fillText(value.toString(), canvas.width / 2, canvas.height / 2);
};
