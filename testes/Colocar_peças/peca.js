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
        this.fase = "colocacao_de_pecas";

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
        if (this.fase === "colocacao_de_pecas") {
            // Fase de colocação de peças
            if (this.nr_pecas_brancas !== 0) {
                this.por_peca(id_celula);
            } else {
                this.fase = "movimento_de_pecas";
                console.log("Iniciando a fase de movimento de peças");
            }
        } else if (this.fase === "movimento_de_pecas") {
            // Fase de movimento de peças
            if (this.nr_pecas_brancas > 0 || this.nr_pecas_pretas > 0) {
                console.log("Você ainda tem peças para colocar na fase de movimento de peças.");
            } else {
                this.movePiece(id_celula);
            }
        }
    }

    //Função movePiece por completar
    movePiece() {
        return;
    }
    
    //Serve como Drop_phase
    por_peca(id_celula) {
        // Query que contém cada célula da tabela
        const posicoes = document.querySelectorAll(".item_tabuleiro");
    
        for (let celula of posicoes) {
            if (id_celula == celula.id) {
                const existingPiece = celula.querySelector('.peca_tabuleiro_preta, .peca_tabuleiro_branca');
                if (!existingPiece) {
                    // A célula está vazia, então podemos colocar uma peça nela
                    let peca = document.createElement('div');
                    // Jogam primeiro quem escolheu as peças pretas
                    if (this.nr_pecas_pretas >= this.nr_pecas_brancas) {
                        this.nr_pecas_pretas--;
                        peca.className = "peca_tabuleiro_preta";
                    } else {
                        this.nr_pecas_brancas--;
                        peca.className = "peca_tabuleiro_branca";
                    }
                    celula.appendChild(peca);
                    console.log("Número atual de peças brancas: " + this.nr_pecas_brancas);
                    console.log("Número atual de peças pretas: " + this.nr_pecas_pretas);
                } else {
                    console.log("Esta célula já possui uma peça. Escolha outra célula vazia.");
                }
            }
        }
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
