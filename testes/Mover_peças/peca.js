window.onload = function () {
    console.log("Dom");
    const counter = new TicTacToe("base");
    let selector_linhas = document.querySelector('#input_linhas_tabuleiro');

    let selector_colunas = document.querySelector('#input_colunas_tabuleiro');

    tabuleiro = new Tabuleiro("tabuleiro", selector_linhas.value, selector_colunas.value);
}

class Tabuleiro {
    //"variaveis estaticas" que permitem guardar o numero de peças brancas e pretas
    //!-----------------------------------------------------
    //!                     AVISO
    //! COLOQUEI MENOS PEÇAS PARA SER MAIS FAICL TESTAR!!!!!
    //!                     AVISO
    //!-----------------------------------------------------


    nr_pecas_brancas = 4;
    nr_pecas_pretas = 4;
    //Numero de linhas e colunas
    rows = 0;
    cols = 0;

    //Quem é que vai mover uma peça(Começa com a peça preta)
    cur_playing = "preta";


    constructor(parentid, rows, cols) {
        let parent = document.getElementById(parentid);

        //Inicializamos as variaveis da classe
        this.rows = rows;
        this.cols = cols;

        //Representamos o tabuleiro como matriz (com indice que começa em 1)
        this.tab = new Array(rows * cols + 1);
        this.tab[0] = "NULL";

        //Guardamos a div que representa o tabuleiro
        this.tabuleiro = document.querySelector('#tabuleiro');

        //Guardamos a fase em que o jogador joga 
        this.GamePhase = "DropPhase";

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
                // Adiciona um evento de clique à div (que depende 
                //do fase do jogo em que estamos)

                child.addEventListener("click", (event) => {
                    if (this.GamePhase == "DropPhase")
                        this.play(event.target.id);
                    else if (this.GamePhase == "MovePhase") {
                        let selected_div = document.querySelector('div.selected');
                        let selected_move = document.getElementById(event.target.id);
                        // console.log("=>Implementar EventListener move phase");
                        // console.log(selected_div);

                        if (selected_div != null &&
                            selected_div.id != event.target.id
                            && this.peca_selecionada_moveu == false
                            && selected_move.classList.contains('peca_tabuleiro_preta') == false       //evita que selecionemos a peça
                            && selected_move.classList.contains('peca_tabuleiro_branca') == false) {
                            console.log("Pronto para mover uma peça")
                            //! Cuidado com estas condições
                            let from = selected_div.parentElement.id;
                            let to = event.target.id;
                            let UP = this.is_Above(from, to);
                            let DOWN = this.is_Down(from, to);
                            let RIGHT = this.is_Right(from, to);
                            let LEFT = this.is_Left(from, to);

                            let test = this.is_valid(from, to)
                            //Verifica se o celula escolhida
                            // é uma jogada válida
                            let valida =
                                (UP || DOWN || RIGHT || LEFT) && test;
                            /*Debug
                            console.log("Valid moves:");
                            console.log("Move UP : " + (UP && test));
                            console.log("Move DOWN : " + (DOWN && test));
                            console.log("Move RIGHT : " + (RIGHT && test));
                            console.log("Move LEFT : " + (LEFT && test));
                            console.log("Can i move : " + valida);
                            */
                            //só faz o movimento se for valido
                            if (valida) {
                                console.log("Movimento escolhido [válido]");
                                let src = selected_div.parentElement;
                                let dest = document.getElementById(event.target.id);

                                //? console.log(dest);
                                //? console.log(src);
                                //Não é necessário remover filho de src 
                                //desta forma ja remove
                                dest.appendChild(src.firstChild);

                                //para quebrar o ciclo na funçao move_peca
                                this.peca_selecionada_moveu = true;

                                //fazer com que o movimento tenha efeito no 
                                //this.tab (array que representa o tabuleiro)

                                this.tab[dest.id] = this.tab[src.id];
                                this.tab[src.id] = undefined;
                            }
                            else {
                                console.log("Movimento escolhido [Inválido]");
                            }
                        }
                        else {
                            console.log("Movimento escolhido inválido");
                        }
                    }
                });
                parent.appendChild(child);

            }
        }

    }

    //verifica se ao mover a peça para esta posição
    // não quebra alguma regra (ex: mais de 3 peças contiguas
    //da mesma cor)
    //!Nota: não verifica se faz um movimento correto ,ou seja,
    //! se faz um movimento de uma só peça.Apenas verifica se é valido
    //! ter nessa posição uma peça
    is_valid(id_celula_origem, id_celula_destino) {
        //Alteraçõe necessarias para o Posição valida funcionar
        if (id_celula_origem != id_celula_destino) {
            let from = document.getElementById(id_celula_origem);
            let to = document.getElementById(id_celula_destino);

            //se a celula destino estiver vazia
            if (this.is_Empty(to.id) == true) {
                // ?console.log("===================is_valid=================");
                // ?console.log(from);
                // ?console.log(to);

                //descobrir a cor da peca em na celula from
                let cor_peca = undefined;
                let aux = from.firstChild;
                for (let c of aux.classList) {
                    if (c.includes("peca_tabuleiro_preta"))
                        cor_peca = "preta";
                    else if (c.includes("peca_tabuleiro_branca"))
                        cor_peca = "branca";
                    // console.log(c);
                }

                //? console.log("Cor da peça para verificar : " + cor_peca);

                // colocar esse movimento em this.tab[from.id]=undefined
                // (para poder usar a função Posicao_valida) 
                this.tab[from.id] = undefined;

                //Verifica se a posição é valida
                let pos_valid = this.Posicao_valida(to.id, cor_peca);
                // ?console.log("Posicao_valida = "+pos_valid);

                //Restauramos o tabuleiro para o estado "original"
                this.tab[from.id] = cor_peca;
                // console.log(this.tab);

                return pos_valid;
                // ?console.log("===========================================");
            }
            else {
                console.log("Posição ocupada");
                //retorna falso caso celula destino esteja ocupada
                return false;
                //alert("Posição ocupada");
            }
        }

    }

    //verifica se a celula e vazia
    is_Empty(id_celula) {
        let aux = document.getElementById(id_celula);

        //caso clique na celula
        return aux.childNodes.length == 0;
    }


    //verifica se a celula clicada esta acima da 
    //celula selecionada
    //idorigem -> id da peça selecionada
    //iddestino -> id da celula selecionada
    is_Above(idorigem, iddestino) {
        // console.log("is_Above(" + idorigem + "," + iddestino + ")");
        if (parseInt(iddestino) + parseInt(this.cols) == parseInt(idorigem))
            return true;
        else {
            // console.log("Celula não se econtra acima da celula "+idorigem );
            return false;
        }
    }
    //(...)
    is_Down(idorigem, iddestino) {
        // console.log("is_Down("+idorigem+","+iddestino+")");
        if (parseInt(iddestino) - parseInt(this.cols) == parseInt(idorigem))
            return true;
        else {
            return false;
        }
    }

    //(...)
    is_Right(idorigem, iddestino) {
        //caso o movimento faça sair do tabuleiro
        if (parseInt(idorigem) % this.cols == 0)
            return false;
        //caso celula de destino esteja a direita da celula de origem
        if (parseInt(iddestino) - 1 == parseInt(idorigem))
            return true;

        return false;
    }

    //(...)
    is_Left(idorigem, iddestino) {
        //caso o movimento faça sair do tabuleiro
        if (parseInt(idorigem) - 1 == 0 ||
            parseInt(idorigem) - 1 % this.cols == 0)
            return false;
        //caso celula de destino esteja a esquerda da celula de origem
        if (parseInt(iddestino) + 1 == parseInt(idorigem))
            return true;

        return false;
    }


    play(id_celula) {
        // Executa a função play com o id da div clicada
        // console.log("Jogo começou");
        // console.log(this.tab);

        if (this.nr_pecas_brancas != 0 || this.nr_pecas_pretas != 0) {
            // console.log("Debug " + this.Eliminar_peca_resolvido);

            //! TER CUIDADO COM ESTA DEFINIÇÃO
            // Se existir um caso em que é possivel remover uma peça
            // então está condição obriga a que se remova primeiro a peça
            // e só depois de remover-la é que this.Eliminar_peca_resolvido 
            // fica a true (nos casos em que não e possivle remover a peça
            //this.Eliminar_peca_resolvido já é verdadeiro)
            if (this.Eliminar_peca_resolvido == true || this.Eliminar_peca_resolvido == undefined)
                this.por_peca(id_celula);
        }
        else {
            //Dá inicio a Move Phase
            this.GamePhase = "MovePhase";
            this.Move();

        }
    }

    Move() {

        //todo aqui temos de verificar se existem condições para 
        //todo acabar o jogo 

        if ((this.selected_a_piece == true || this.selected_a_piece == undefined) &&
            (this.peca_selecionada_moveu == true || this.peca_selecionada_moveu == undefined) && 
            (this.Eliminar_peca_resolvido == true || this.Eliminar_peca_resolvido == undefined)) {
            console.log("Move Phase");
            console.log("Próximo a mover : " + this.cur_playing);
            let cor_peca = this.cur_playing;
            if (this.cur_playing == "preta")
                this.cur_playing = "branca";
            else
                this.cur_playing = "preta";

            this.move_peca(cor_peca);
        }
    }

    async move_peca(cor_peca) {

        this.started = true;
        //fazer um ciclo até chegar ao fim ou 
        // até um jogador desistir
        console.log("Dentro de move_peca");
        console.log("Vez da cor " + cor_peca);




        let pecas_pretas = document.querySelectorAll('div.peca_tabuleiro_preta');
        let pecas_brancas = document.querySelectorAll('div.peca_tabuleiro_branca');
        // let all_pecas = document.querySelectorAll('div.item_tabuleiro > div')
        // console.log(pecas_brancas);
        // console.log(pecas_pretas);


        // usamos esta var , para ter uma variavel "global"
        //dentro deste bloco (para permitir que ao clicar
        //uma peça qualquer ela fique verdadeira)
        var selected = false;

        await sleep (300);

        //Associa a cada peça o id da celula correspondente 
        //Para todas as peças presentes no tabuleiro
        if (cor_peca == "branca") {
            console.log("ESTOU A ADICIONAR O CLICK SELECTED");
            for (let peca of pecas_brancas) {
                //! IMPORTANTE
                //! o id da peça serve para depois 
                //! colocar em this.tab o movimento de peças
                //! que ocorreu
                // todo peca.id = peca.parentElement.id;
                //Adicionamos um evente as peças que podem 
                // se mover neste turno(caso seja clicada 
                //uma peca colocamos true na selected_a_piece
                //para garantir que esperamos que o utilizador
                //clique na peça)
                /*
                peca.addEventListener('click', function () {
                    peca.style["border-color"] = "#60e550";
                    peca.classList.add("selected");
                    selected = true;
                });
                */
                peca.onclick = function(){
                    peca.style["border-color"] = "#60e550";
                    peca.classList.add("selected");
                    selected = true;
               }
            }
        }
        else if (cor_peca == "preta") {
            console.log("ESTOU A ADICIONAR O CLICK SELECTED");
            for (let peca of pecas_pretas) {
                //todo peca.id =  peca.parentElement.id;
                //(...)
                /*
                peca.addEventListener('click', function  () {
                    peca.style["border-color"] = "#60e550";
                    peca.classList.add("selected");
                    selected = true;
                });
                */
                peca.onclick = function(){
                    peca.style["border-color"] = "#60e550";
                    peca.classList.add("selected");
                    selected = true;
               }
            }
        }


        this.selected_a_piece = false;
        while (selected == false) {
            console.log("A ESPERA QUE SELECIONEM A PEÇA PARA MOVER");
            await sleep(100);
        }
        console.log("SELECIONOU UMA PEÇA")

        //retira a possibilidade de selecionar das outras peças
        // para impedir que selecionemos mais do que uma peça
        restore(false);

        // console.log(selected_piece);

        // console.log(this.tabuleiro);


        this.peca_selecionada_moveu = false;
        //Ciclo em baixo quebra quando movemos a peça para outra casa
        while (this.peca_selecionada_moveu == false) {
            console.log("A ESPERA MOVAM A PEÇA");
            await sleep(1000);
        }
        console.log("PEÇA MOVEU");
        /* 
        !Depois de mover a peça
        */
        let selected_piece = document.querySelector('.selected');

        //verifica se Após o movimento é possivel eliminar uma peça
        this.Eliminar_peca_resolvido = false;
        this.Eliminar_peca(selected_piece.parentElement.id,cor_peca);

        while (this.Eliminar_peca_resolvido == false){
            console.log("A ESPERA QUE REMOVAM PEÇA(MOVE PHASE)");
            await sleep(200);
        }

        //retira a possibilidade de selecionar de todas as peças
        restore(true);


        console.log(this.tab);
        // this.peca_selecionada_moveu = true;
        this.selected_a_piece = true;

        //Chamamos o MOVE() outra vez no fim
        this.Move();

    }




    //Serve como Drop_phase
    async por_peca(id_celula) {
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

                    //Verifica se a posição é válida
                    if (this.Posicao_valida(celula.id, "preta") == true) {
                        // ?console.log("TESTE =>" + this.Posicao_valida(celula.id, "preta"));
                        //Diminuimos o nr de peças pretas
                        this.nr_pecas_pretas--;
                        //Atribuimos uma classe a div peça (tornando-a visivel no ecra)
                        peca.className = "peca_tabuleiro_preta";
                        //Colocamos no Array que representa o tab qual a cor 
                        //da peça que esta ness posição
                        this.tab[celula.id] = "preta";


                        //adicionamos como filho 
                        celula.appendChild(peca);

                        //Parte de eliminar (caso seja possivel)

                        this.Eliminar_peca_resolvido = false;
                        this.Eliminar_peca(celula.id, "preta");

                        /* Ciclo para fazer debug */
                        while (this.Eliminar_peca_resolvido == false) {
                            console.log("A ESPERA QUE REMOVAM PEÇA")
                            await sleep(200);
                        }

                    }
                    //Se for inválida manda um alert 
                    else {

                        alert("POSIÇÃO INVALIDA: não é possivel ter mais de 3 peças contiguas na mesma linha ou coluna");

                    }
                }
                else {

                    //Verifica se a posição é válida
                    if (this.Posicao_valida(celula.id, "branca") == true) {
                        //?console.log("TESTE =>" + this.Posicao_valida(celula.id, "branca"));

                        //Diminuimos o nr de peças brancas
                        this.nr_pecas_brancas--;
                        //Atribuimos uma classe a div peça (tornando-a visivel no ecra)
                        peca.className = "peca_tabuleiro_branca";
                        //Colocamos no Array que representa o tab qual a cor 
                        //da peça que esta ness posição
                        this.tab[celula.id] = "branca";


                        //adicionamos como filho 
                        celula.appendChild(peca);

                        //Parte de eliminar (caso seja possivel)

                        this.Eliminar_peca_resolvido = false;
                        this.Eliminar_peca(celula.id, "branca");

                        /* Ciclo para fazer debug */
                        while (this.Eliminar_peca_resolvido == false) {
                            console.log("A ESPERA QUE REMOVAM PEÇA")
                            await sleep(200);
                        }
                    }
                    //Se for inválida manda um alert
                    else {
                        alert("POSIÇÃO INVALIDA: não é possivel ter mais de 3 peças contiguas na mesma linha ou coluna");
                    }

                }

                // console.log("Número atual de peças brancas:" + this.nr_pecas_brancas);
                // console.log("Número atual de peças pretas:" + this.nr_pecas_pretas);
            }
            else if (id_celula == celula.id && celula.childElementCount != 0) {
                console.log("Celula está ocupada");
                alert("Posição ocupada,por favor selecione uma posição vazia");
            }

        }

    }



    //Verifica se estamos em condições de elimar uma peça inimiga 
    //async (apenas permite implementar um sleep , que é utilizado
    // no ciclo while )
    async Eliminar_peca(Posicao, cor_peca) {
        let coluna = this.coluna_aux(Posicao, cor_peca);
        let linha = this.linha_aux(Posicao, cor_peca);
        //[Max_nr_peças_linha,Max_nr_peças_coluna]
        let aux = Max_Pecas_continguas(linha, coluna, cor_peca, Posicao);



        if (aux[0] == 3 || aux[1] == 3) {
            let peca_a_remover = "";
            switch (cor_peca) {
                case "preta":
                    peca_a_remover = "peca_tabuleiro_branca";
                    break;
                case "branca":
                    peca_a_remover = "peca_tabuleiro_preta";
                    break;
                default:
                    console.log("ERRO: em Eliminar_peca");
            }


            console.log("Podemos remover uma peça da cor " + peca_a_remover);
            //todo Implementar o metodo de remover uma peça

            //Guardamos todas as divs que correspondem as peças
            let divs = document.querySelectorAll('div.item_tabuleiro > div');

            console.log(divs);
            //Percorre todas as peças e adiciona um evento de click
            //a cada peça que é possivel remover
            for (let peca of divs) {
                if (peca.className == peca_a_remover) {
                    /*
                    peca.addEventListener('click', function () {
                        // Adicionamos um evento a cada filho
                        peca.parentNode.removeChild(peca);

                    });
                    */
                    peca.onclick = function(){
                        peca.parentNode.removeChild(peca);
                    }
                    // peca.addEventListener("click",remove(peca.parentElement.id));
                    peca.style["border-color"] = "red";
                }
            }
            let changed = document.querySelectorAll('div.item_tabuleiro > div');

            //fica a espera (neste caso 1 segundo) 
            //que seja removido algum elemento

            while (divs.length == changed.length) {
                // console.log("VERIFICA");
                await sleep(100);
                changed = document.querySelectorAll('div.item_tabuleiro > div');
            }

            //Percorre todas as peças e remove o enventListner
            //para impedir que seja possivel remover mais peças


            for (let peca of divs) {
                if (peca.className == peca_a_remover) {
                    peca.style["border-color"] = "grey";
                    peca.onclick = function(){}
                    // peca.removeEventListener('click',remove);
                }
            }

            console.log("Removeu a peça");
        }
        else {
            console.log("Nao existe condições para remover");
        }

        //Para indicar em por_peça que a execução pode continuar
        this.Eliminar_peca_resolvido = true;
    }

    //Cria um array que representa a linha a que pertence a peça 
    linha_aux(Posicao, cor_peca) {
        //Array que guarda a linha em que peça que queremos metar está (contém as cores)
        let cur_linha = new Array(this.cols + 1); //indice começa em 1

        let indice_final = Posicao;
        while (indice_final % this.cols != 0) {
            indice_final++;
        }
        let indice_inicial = indice_final - this.cols + 1;
        // console.log("Indices que pertencem a linha: [" + indice_inicial + "," + indice_final + "]");

        //coloco as cores correspondentes do array tab no cur_linha
        let k = 1;
        for (let i = indice_inicial; i <= indice_final; i++) {
            cur_linha[k] = this.tab[i];
            k++;
        }

        return cur_linha;
    }

    //Cria um array que representa a coluna a que pertence a peça 
    coluna_aux(Posicao, cor_peca) {
        //Array que guarda a coluna em que peça que queremos meter está (contém as cores)
        let cur_coluna = new Array(this.rows + 1);//indice começa em 1

        let indice_inicial = parseInt(Posicao);

        while (indice_inicial > this.cols) {
            indice_inicial -= this.cols;

        }

        let indice_final = indice_inicial;
        while (indice_final < this.rows * this.cols) {
            if (indice_final + parseInt(this.cols) > this.rows * this.cols)
                break;
            indice_final += parseInt(this.cols);
        }

        // console.log("Indices que pertencem a coluna: [" + indice_inicial + "," + indice_final + "]");

        //coloco as cores correspondentes do array tab no cur_coluna
        let k = 1;
        for (let i = indice_inicial; i <= indice_final; i += parseInt(this.cols)) {
            // console.log("=>"+i);
            cur_coluna[k] = this.tab[i];
            k++;
        }
        return cur_coluna;

    }

    //Verifica se a posição em que queremos inserir uma peça valida (verifica se não há mais do que 3 peças
    //contiguas da mesma cor na horizontal ou vertical)
    Posicao_valida(Posicao, cor_peca) {
        //Array que guarda a linha em que peça que queremos metar está (contém as cores)
        let cur_linha = this.linha_aux(Posicao, cor_peca); //indice começa em 1

        //Array que guarda a coluna em que peça que queremos meter está (contém as cores)
        let cur_coluna = this.coluna_aux(Posicao, cor_peca);//indice começa em 1

        /* Debug
        console.log("-------------------------------");
        console.log("-----Linha da Posição (" + Posicao + ") -------")
        console.log(cur_linha);
        console.log("-----Coluna da Posição(" + Posicao + ") -------")
        console.log(cur_coluna);
        console.log("-------------------------------");
        */

        let peca_contiguas = Max_Pecas_continguas(cur_linha, cur_coluna, cor_peca, Posicao);


        if (peca_contiguas[0] <= 3 && peca_contiguas[1] <= 3)
            return true;
        else {
            return false;
        }
    }




}



function remove(parent){
    let aux = document.getElementById(parent);
    console.log("Remove filho de " + aux.id )
    aux.removeChild(aux.firstChild);

}


//dessacocia a div que representa a peca , a id da
// "quadradinho" onde ela esta e remove
//o respetivo EventListener (para o selecionamento)
// só remove a class selected se o argumento fo true
function restore(incluir_peca_selecionada) {
    let all_pecas = document.querySelectorAll('div.item_tabuleiro >div');
    let selected_piece = document.querySelector('.selected');
    // console.log("UnAssoc_id");
    // console.log(all_pecas);
    for (peca of all_pecas) {
        //    console.log(peca);
        if (peca.classList.contains("selected")) {
            // console.log("EUREKA");
            if (incluir_peca_selecionada == true) {
                peca.classList.remove("selected")
                peca.style["border-color"] = "grey";
                peca.id = "p" + peca.parentElement.id;
                peca.replaceWith(peca.cloneNode(true));
            }
        }
        else {
            peca.style["border-color"] = "grey";
            peca.id = "p" + peca.parentElement.id;
            peca.replaceWith(peca.cloneNode(true));
        }

    }

}



function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}



//Verifica o numero de peças contiguas da mesma cor ao inserir a peça nesta posição
//e retorna um array [Max_pecas_contíguas_linha,Max_pecas_contíguas_coluna] 
function Max_Pecas_continguas(linha, coluna, cor_peca, Posicao) {
    let cols = linha.length - 1;
    // console.log("cur cols = " + cols);

    //indice original ajustada para indice no array linha
    let pos_col_on_array = parseInt(Posicao);

    while (pos_col_on_array > cols) {
        pos_col_on_array -= cols;
    }

    //indice original ajustada para indice no array coluna 
    let pos_row_on_array = 1;
    let aux = parseInt(Posicao);
    while (aux > 0) {
        aux -= cols;
        if (aux <= 0)
            break;
        pos_row_on_array++;
    }

    // ?console.log("pos_col_on_array = "+ pos_col_on_array);
    // ?console.log("pos_row_on_array = "+ pos_row_on_array);

    //Maior numero de pecas contíguas,da mesma cor , na linha e coluna 
    //onde queremos inserir a nossa peça (esta contagem
    //tem em conta a peça que queremos por, ela faz parte deste nr) 
    let nr_pecas_linha = Biggest_sequence(linha, cor_peca, pos_col_on_array);
    let nr_pecas_coluna = Biggest_sequence(coluna, cor_peca, pos_row_on_array);
    //? console.log("maior numero de peças (" + cor_peca + "s) contiguas nesta LINHA = " + nr_pecas_linha);
    //? console.log("maior numero de peças (" + cor_peca + "s) contiguas nesta COLUNA = " + nr_pecas_coluna);

    //Jogada valida (nao tem mais de 3 peças da mesma cor contiguas)
    if (nr_pecas_linha <= 3 && nr_pecas_coluna <= 3)
        return [nr_pecas_linha, nr_pecas_coluna];
    else {
        console.log("JOGADA INVALIDA: não podemos ter mais de 3 peças contiguas da mesma cor (vertical ou horizontal)");
        return [nr_pecas_linha, nr_pecas_coluna];
    }
}








//retorna qual e a maior sequencia simultânea de pecas com a mesma 
//cor
function Biggest_sequence(seq, cor_peca, pos) {
    let ans = 0;
    let cur_max = 0

    // console.log("Dentro Biggest");

    //!colocamos la a peça
    // console.log("=>"+pos);
    seq[pos] = cor_peca;

    //ciclo que procura a maior sequencia de peças com a cor == cor_peca
    for (let i = 1; i < seq.length; i++) {
        //?console.log("seq["+i+ "]="+seq[i]);
        if (seq[i] == cor_peca) {
            cur_max++;
        }
        else {
            if (cur_max > ans)
                ans = cur_max;
            cur_max = 0;
        }
    }
    if (cur_max > ans) {
        ans = cur_max;
    }

    // console.log("Maior sequencia contígua ,na linha atual , de peças da cor " + cor_peca + " = " + ans);


    //!retiramos a peça colocada 
    seq[pos] = undefined;

    return ans;

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
