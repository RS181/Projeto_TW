/* Classe que representa o tabuleiro*/
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
                parent.appendChild(child);
                child.className = "item_tabuleiro"

                // Calcula o id da criança com base em sua posição na grade
                child.id = (i * cols) + j + 1;


                //Adiciona um evento clique a div 
                child.addEventListener("click", (event) => {
                    this.play(event.target.id);
                });
                parent.appendChild(child);
            }
        }
    }

    //Começa o jog em si
    play(id_celula) {
        // Executa a função play com o id da div clicada
        //console.log("entrei no play");


        //Enquanto tem pecas para jogar
        if (this.nr_pecas_brancas != 0 || this.nr_pecas_pretas != 0)
            this.por_peca(id_celula);
        else {
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

            //Entramos no if se a celula não tem peça dentro dela e tem
            //o respetivo id
            if (id_celula == celula.id && celula.childElementCount == 0) {

                //Jogam primeiro quem escolheu as peças pretas 
                if (this.nr_pecas_pretas >= this.nr_pecas_brancas) {
                    this.nr_pecas_pretas--;
                    peca.className = "peca_tabuleiro_preta";
                    //Usamos o title para indicar que a celula esta ocupado (com uma peça)
                }
                else {
                    this.nr_pecas_brancas--;
                    peca.className = "peca_tabuleiro_branca";
                    //Usamos o title para indicar que a celula esta ocupado (com uma peça)

                }
                celula.appendChild(peca);
                console.log("Número atual de peças brancas:" + this.nr_pecas_brancas);
                console.log("Número atual de peças pretas:" + this.nr_pecas_pretas);
            }
            else if(id_celula == celula.id && celula.childElementCount != 0) {
                console.log("Celula está ocupada");
                alert("Posição ocupada,por favor selecione uma posição vazia");
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

/* Funcao que vai buscar o nr de linhas e colunas ao "input" do utilizador
e cria um novo tabuleiro */
function get_nr_linhas_colunas() {
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



/* Funcao que vai buscar qual o oponente escolhido */
function displayRadioValue() {
    let x = document.getElementById("Mostrar");
    x.className = "";
    var ele = document.getElementsByName('Checkgroup_escolha_jogador');
    for (i = 0; i < ele.length; i++) {
        if (ele[i].value == "escolha_computador" && ele[i].checked == true) {
            // console.log("Escolheu computador");
            create(x.id, "computador");
        }
        else {
            // console.log("Escolheu jogador");
            removeAllChildNodes(x);
            create(x.id, "jogador");
        }
        // console.log(ele[i].value + "=" + ele[i].checked);
    }

}


//Função que decidi qual div criar 
function create(parentid, oponente) {
    console.log("Oponente: " + oponente);
    let parent = document.getElementById(parentid);

    removeAllChildNodes(parent);

    if (oponente == "computador")
        create_div_Computer(parentid);
    else if (oponente == "jogador")
        create_div_Player(parentid);
}

//Função que cria a div que contém a escolha de dificuldade
function create_div_Computer(parentid) {
    let parent = document.getElementById(parentid);
    parent.className = "item";

    //criamos uma div ao elemento com o id parentid
    //criamos um fieldset com respetivas legendas
    let fieldset = document.createElement("fielset")
    let legend = document.createElement("legend");


    //Colocamos as propriedades
    legend.innerText = "Indique a dificuldade da Ia";
    fieldset.id = "escolha_dificuldade"


    //Fazemos os appends de filhos do "mais velho" ao "mais novo"
    parent.appendChild(fieldset);
    fieldset.appendChild(legend);

    //criação dos radiobutton da dificuldade
    for (let i = 1; i <= 5; i++) {
        let radiobutton = document.createElement("input");
        radiobutton.id = "radio" + i;
        radiobutton.type = "radio";
        radiobutton.name = "teste";
        radiobutton.value = "dificuldade_" + i;
        // radiobutton.name = "Checkgroup_escolha_jogador";
        fieldset.appendChild(radiobutton);

        //criação do label para o radiobutton
        let label = document.createElement("label");
        label.textContent = "" + i;
        label.htmlFor = "radio" + i;
        fieldset.appendChild(label);
    }
}


//Função que mostra a div que indica o primeiro jogador a jogar
function create_div_Player(parentid) {
    // console.log("In create_div_Player")
    let parent = document.getElementById(parentid);
    parent.className = "item";

    //criamos uma div ao elemento com o id parentid
    //criamos um fieldset com respetivas legendas
    let fieldset = document.createElement("fielset")
    let legend = document.createElement("legend");


    //Colocamos as propriedades
    legend.innerText = "Indique Quem Joga Primeiro";
    fieldset.id = "escolha_quem_joga_primeiro";

    //Fazemos os appends de filhos do "mais velho" ao "mais novo"
    parent.appendChild(fieldset);
    fieldset.appendChild(legend);

    //criamos os radioButtons
    for (let i = 1; i <= 2; i++) {
        let radiobutton = document.createElement("input");
        let label = document.createElement("label");

        radiobutton.id = "radio" + i;
        radiobutton.type = "radio";
        radiobutton.name = "teste";
        label.htmlFor = "radio" + 1;


        fieldset.appendChild(radiobutton);
        fieldset.appendChild(label);


        //criação do label para o radiobutton
        if (i == 1) {
            label.textContent = "Jogador";
            radiobutton.value = "jogador_joga_primeiro";
        }
        else {
            label.textContent = "Oponente";
            radiobutton.value = "oponente_joga_primeiro";

        }
    }



}



//O que é carregado no inicio
window.onload = function () {
    console.log("Carregou a Dom");

    let selector_linhas = document.querySelector('#input_linhas_tabuleiro');
    let selector_colunas = document.querySelector('#input_colunas_tabuleiro');

    tabuleiro = new Tabuleiro("tabuleiro", selector_linhas.value, selector_colunas.value);

    displayRadioValue()
}