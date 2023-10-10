window.onload = function () {
    console.log("Dom");
    const counter = new TicTacToe("base");
    let selector_linhas = document.querySelector('#input_linhas_tabuleiro');

    let selector_colunas = document.querySelector('#input_colunas_tabuleiro');

    tabuleiro = new Tabuleiro("tabuleiro", selector_linhas.value, selector_colunas.value);
}

class Tabuleiro {
    //"variaveis estaticas" que permitem guardar o numero de peças brancas e pretas
    nr_pecas_brancas = 12;
    nr_pecas_pretas = 12;

    constructor(parentid, rows, cols) {
        let parent = document.getElementById(parentid);


        if (rows == 6 && cols == 5) {
            console.log("Tabuleiro 6 por 5");
            parent.className = "tabuleiro_6_por_5";
        }
        else if (rows == 6 && cols == 6) {
            console.log("Tabuleiro 6 por 6");
            parent.className = "tabuleiro_6_por_6";
        }
        else if (rows == 5 && cols == 5) {
            console.log("Tabuleiro 5 por 5");
            parent.className = "tabuleiro_5_por_5";
        }
        else if (rows == 5 && cols == 6) {
            console.log("Tabuleiro 5 por 6");
            parent.className = "tabuleiro_5_por_6"
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let child = document.createElement("div");
                child.className = "item_tabuleiro"

                // Calcula o id da criança com base em sua posição na grade
                child.id = (i * cols) + j + 1;
                // Adiciona um evento de clique à div

                child.addEventListener("click", (event) => {
                    this.play(event.target.id);
                });
                parent.appendChild(child);

            }
        }

        //this.play(parentid, 12, 12);
    }

    play(id_celula) {
        // Executa a função play com o id da div clicada
        console.log("entrei no play");
   
        if (this.nr_pecas_brancas != 0 && this.nr_pecas_pretas!=0)
            this.por_peca(id_celula);
        else{
            console.log("TODO: Implementar a move phase")
        }
    }

    //Serve como Drop_phase
    por_peca(id_celula) {
        //Query que contem cada celula da tabela
        const posicoes = document.querySelectorAll(".item_tabuleiro");
        //Debug de consola
       

        //todo Falta fazer verificação a ver se posição e valida para colocar 
        for (let celula of posicoes) {
            let peca = document.createElement('div');
            //Jogam primeiro quem escolheu as peças pretas 
            if (id_celula == celula.id) {
                if (this.nr_pecas_pretas >= this.nr_pecas_brancas) {
                    this.nr_pecas_pretas--;
                    peca.className = "peca_tabuleiro_preta";
                }
                else {
                    this.nr_pecas_brancas--;
                    peca.className = "peca_tabuleiro_branca";
                }
                celula.appendChild(peca);
            }
            
        }
        console.log("Número atual de peças brancas:" + this.nr_pecas_brancas);
        console.log("Número atual de peças pretas:" + this.nr_pecas_pretas);

    }

}

class TicTacToe {
    constructor(id) { //...      
        this.content = new Array(9);
        this.board = new Array(9);
        this.current = 'X';
        // ...
        const parent = document.getElementById(id);
        const board = document.createElement('div');

        board.className = 'board';
        parent.appendChild(board);
        //..

        for (let i = 0; i < 9; i++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            board.appendChild(cell);

            cell.onclick = () => this.play(i);

            this.board[i] = cell;
        }
    }
    play(pos) {
        this.content[pos] = this.current;
        this.board[pos].innerHTML = this.current;

        this.current = (this.current == 'X' ? 'O' : 'X');
    }
}



//Função que remove todos os filhos de um pai
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function getOption() {
    let selector_linhas = document.querySelector('#input_linhas_tabuleiro');
    let selector_colunas = document.querySelector('#input_colunas_tabuleiro');
    console.log(selector_linhas.value + " " + selector_colunas.value);

    //vamos buscar o div com o tabuleiro atual
    let tabuleiro = document.getElementById('tabuleiro');
    //removemos todos os seus filhos (para poder colocar novos 'div' filhos)
    removeAllChildNodes(tabuleiro);
    //criamos um novo Tabuleiro com as linhas e colunas selecionadas
    tabuleiro = new Tabuleiro("tabuleiro", selector_linhas.value, selector_colunas.value);
}
