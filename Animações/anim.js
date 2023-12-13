//Animação de carregar
var canvas = null;
var context = null;
var rotateAngle = null;
var animateTheLoader = true; // falso para ser estático
window.onload = function () {
    //Animação de carregar
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext("2d");
    rotateAngle = 0;

    if (animateTheLoader) {
        loadingAnimation();
    }
    else {
        loadingDrawing();
    }

}
function loadingDrawing() {
    context.save();

    context.translate(30, 30);
    context.rotate(rotateAngle * Math.PI / 180);
    context.translate(-30, -30);

    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 2; // Ajuste a largura da linha
    context.lineCap = "round";

    context.fillStyle = "rgba(0,0,0,1)";
    context.moveTo(30, 24);
    context.lineTo(30, 8);
    context.stroke();

    context.strokeStyle = "rgba(0,0,0,0.8)";
    context.moveTo(27, 27);
    context.lineTo(18, 18);
    context.stroke();

    context.strokeStyle = "rgba(0,0,0,0.5)";
    context.moveTo(24, 30);
    context.lineTo(8, 30);
    context.stroke();

    context.strokeStyle = "rgba(0,0,0,0.35)";
    context.moveTo(27, 33);
    context.lineTo(18, 42);
    context.stroke();

    context.strokeStyle = "rgba(0,0,0,0.2)";
    context.moveTo(30, 37);
    context.lineTo(30, 48);
    context.stroke();

    context.closePath();

    context.save();

    context.restore();
}

function loadingDrawing() {
    context.save();

    // Centraliza a animação no meio do canvas
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    context.translate(centerX, centerY);

    context.rotate(rotateAngle * Math.PI / 180);
    context.translate(-30, -30);

    context.translate(30, 30);
    context.rotate(rotateAngle * Math.PI / 180);
    context.translate(-30, -30);

    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 2; // Ajuste a largura da linha
    context.lineCap = "round";

    context.fillStyle = "rgba(0,0,0,1)";
    context.moveTo(30, 24);
    context.lineTo(30, 8);
    context.stroke();

    context.strokeStyle = "rgba(0,0,0,0.8)";
    context.moveTo(27, 27);
    context.lineTo(18, 18);
    context.stroke();

    context.strokeStyle = "rgba(0,0,0,0.5)";
    context.moveTo(24, 30);
    context.lineTo(8, 30);
    context.stroke();

    context.strokeStyle = "rgba(0,0,0,0.35)";
    context.moveTo(27, 33);
    context.lineTo(18, 42);
    context.stroke();

    context.strokeStyle = "rgba(0,0,0,0.2)";
    context.moveTo(30, 37);
    context.lineTo(30, 48);
    context.stroke();

    context.closePath();

    context.save();

    context.restore();
}

function loadingAnimation() {
    canvas.width = canvas.width; // redraw canvas for animation effect

    loadingDrawing();

    rotateAngle += 5;

    if (rotateAngle > 360) {
        rotateAngle = 5;
    }

    setTimeout(loadingAnimation, 30);
}