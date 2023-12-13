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
    canvas.style.visibility= "hidden";
    if (animateTheLoader) {
        loadingAnimation();
    }
    else {
        loadingDrawing();
    }


}


function StartAnimation(){
    canvas.style.visibility = "visible" ;

}
function StopAnimation(){
    canvas.style.visibility= "hidden";
}

function loadingDrawing() {
    context.save();

    // Centraliza a animação no meio do canvas
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    context.translate(centerX, centerY);

    context.rotate(rotateAngle * Math.PI / 180);

    // Comprimento uniforme para todos os traços
    var lineLength = 20;

    // Array de cores
    var colors = ["black", "#202020", "#606060", "#808080", "#A0A0A0", "#E0E0E0"];

    // Desenha cada traço com uma cor diferente
    for (var i = 0; i < 360; i += 60) {
        context.beginPath();
        context.strokeStyle = colors[i / 60];
        context.lineWidth = 5; // Ajuste a largura da linha
        context.lineCap = "round";

        // Move para o ponto inicial
        context.moveTo(0, 0);

        // Desenha a linha
        context.lineTo(0, -lineLength);
        context.stroke();

        // Retorna à posição inicial antes de rotacionar para o próximo traço
        context.rotate(60 * Math.PI / 180);
    }

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