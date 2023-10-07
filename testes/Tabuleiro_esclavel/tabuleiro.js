class Tabuleiro{

    constructor (parentid,rows,cols){
        let parent = document.getElementById(parentid);
        if (rows == 6 && cols == 5) {
            console.log("Tabuleiro 6 por 5");
            parent.className ="tabuleiro_6_por_5";
        }
        else if (rows == 6 && cols == 6){
            console.log("Tabuleiro 6 por 6");
            parent.className = "tabuleiro_6_por_6";
        }
        else if (rows == 5 && cols == 5){
            console.log("Tabuleiro 5 por 5");
            parent.className = "tabuleiro_5_por_5";
        }
        else if (rows == 5 && cols == 6){
            console.log("Tabuleiro 5 por 6");
            parent.className ="tabuleiro_5_por_6"
        }
        
        for (let i = 0 ; i < rows ;i++ ){
            for (let j = 0 ; j < cols ; j++){
                let child = document.createElement("div");
                parent.appendChild(child);
                child.className="item_tabuleiro"
            }
        }
        
       
    }

}

//Função que remove todos os filhos de um pai
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function getOption(){
    let selector_linhas = document.querySelector('#input_linhas_tabuleiro');
    let selector_colunas = document.querySelector('#input_colunas_tabuleiro');
    console.log(selector_linhas.value + " " + selector_colunas.value );

    //vamos buscar o div com o tabuleiro atual
    let tabuleiro = document.getElementById('tabuleiro');
    //removemos todos os seus filhos (para poder colocar novos 'div' filhos)
    removeAllChildNodes (tabuleiro);
    //criamos um novo Tabuleiro com as linhas e colunas selecionadas
    tabuleiro = new Tabuleiro("tabuleiro",selector_linhas.value,selector_colunas.value);
}

window.onload = function(){
    console.log("Carregou a Dom");
    let selector_linhas = document.querySelector('#input_linhas_tabuleiro');

    let selector_colunas = document.querySelector('#input_colunas_tabuleiro');

    tabuleiro = new Tabuleiro("tabuleiro",selector_linhas.value,selector_colunas.value);
}

