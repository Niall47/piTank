

var Visualiser = (function(container, parameters, callback) {
    parameters = parameters || {};
    var title = (typeof parameters.title === "undefined" ? "Visualiser" : parameters.title),
        width = (typeof parameters.width === "undefined" ? 0 : parameters.width),
        height = (typeof parameters.height === "undefined" ? 0 : parameters.height)

    var objContainer = document.getElementById(container);
    var canvas = document.createElement("canvas");
    canvas.id = title;
    if(width === 0) { width = objContainer.clientWidth; }
    if(height === 0) { height = objContainer.clientHeight; }
    canvas.width = width;
    canvas.height = height;
    objContainer.appendChild(canvas);
    var context=canvas.getContext("2d");

    drawExternal();

    function drawExternal()
    {
        var grd = context.createLinearGradient(0,0,100,100);
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "white");
        context.fillStyle = grd;
        context.fillRect(10,10,150,80);

        context.stroke();
    }


});

// Vis = new Visualiser('visualiserDiv', {})