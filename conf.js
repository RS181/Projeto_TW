/* Classe que representa o tabuleiro*/
class Tabuleiro {
    //"variaveis estaticas" que permitem guardar o numero de peças brancas e pretas
    nr_pecas_brancas = 12;
    nr_pecas_pretas = 12;

    //Numero de linhas e colunas
    rows = 0;
    cols = 0;

    //Array booleano que contem as linhas/colunas com 3 peças
    //contiguas da mesma cor
    used_linha_preta = undefined;
    used_coluna_preta = undefined;
    used_linha_branca = undefined;
    used_coluna_branca = undefined;

    //Quem é que vai mover uma peça(Começa com a peça preta)
    cur_playing = "preta";

    constructor(parentid, rows, cols, dificulty) {
        let parent = document.getElementById(parentid);

        //Inicializamos as variaveis da classe
        this.rows = rows;
        this.cols = cols;
        this.used_linha_preta = new Array(parseInt(rows) + 1).fill(false);  //indice começa em 1
        this.used_coluna_preta = new Array(parseInt(cols) + 1).fill(false);
        this.used_linha_branca = new Array(parseInt(rows) + 1).fill(false);
        this.used_coluna_branca = new Array(parseInt(cols) + 1).fill(false);

        this.dificulty = dificulty;
        //?console.log(this.used_linha_preta);
        //?console.log(this.used_coluna_preta);

        console.log("Dificuldade da Ia = " + this.dificulty);

        //Representamos o tabuleiro como array (com indice que começa em 1)
        this.tab = new Array(rows * cols + 1);
        this.tab[0] = "NULL";

        //Representamos a ultima deslocação das peças brancas e pretas
        //por dois arrays [de onde veio , onde esta]
        this.Last_Move_preta = new Array(2);
        this.Last_Move_branca = new Array(2);

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
                        let from = selected_div.parentElement.id;
                        let to = event.target.id;
                        // console.log("=>Implementar EventListener move phase");

                        if (selected_div != null &&
                            selected_div.id != event.target.id
                            && this.peca_selecionada_moveu == false
                            && selected_move.classList.contains('peca_tabuleiro_preta') == false       //evita que selecionemos a peça
                            && selected_move.classList.contains('peca_tabuleiro_branca') == false
                            && !(this.Last_Move_branca[0] == to && this.Last_Move_branca[1] == from)
                            && !(this.Last_Move_preta[0] == to && this.Last_Move_preta[1] == from)) {

                            console.log("Pronto para mover uma peça")
                            //! Cuidado com estas condições
                            /*
                            console.log(from + " -> " + to);
                            console.log("BRANCA " + this.Last_Move_branca);
                            console.log("PRETA " + this.Last_Move_preta);
                            let a = this.Last_Move_branca[0];
                            let b = this.Last_Move_branca[1];
                            let c = this.Last_Move_preta[0];
                            let d = this.Last_Move_preta[1];
                            console.log("Condição Branca (("+a +","+ b+") != " + "("+to +","+from+")) :" + !(a == to && b == from));
                            console.log("Condição Preta (("+c +","+ d+") != " + "("+to +","+from+")) :" + !(c == to && d == from));
                            */
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

                                //Guarda o utlimo movimento da peca
                                if (this.cur_playing == "preta") {
                                    // console.log("branca" + src.id+ "->"+ dest.id);
                                    this.Last_Move_branca[0] = src.id;
                                    this.Last_Move_branca[1] = dest.id;
                                }
                                else if (this.cur_playing == "branca") {
                                    // console.log("preta" + src.id+ "->"+ dest.id);
                                    this.Last_Move_preta[0] = src.id;
                                    this.Last_Move_preta[1] = dest.id;
                                }

                                //fazer com que o movimento tenha efeito no 
                                //this.tab (array que representa o tabuleiro)
                                this.tab[dest.id] = this.tab[src.id];
                                this.tab[src.id] = undefined;

                                let vez = "";
                                if (this.cur_playing == "branca")
                                    vez = "preta";
                                else
                                    vez = "branca";

                                let coluna = this.coluna_aux(src.id, vez);
                                let linha = this.linha_aux(src.id, vez);
                                let aux = Max_Pecas_continguas(linha, coluna, vez, src.id, this.GamePhase,"");
                                console.log("VERIFICAÇÃO APÓS MOVIMENTO(" + vez + "): " + aux);

                                if (vez == "preta") {
                                    if (aux[0] < 3) {
                                        this.used_linha_preta[aux[2]] = false;
                                        // console.log("LINHA " + aux[2] + " está disponivel para remover");
                                    }
                                    if (aux[1] < 3) {
                                        this.used_coluna_preta[aux[3]] = false;
                                        // console.log("coluna " + aux[3] + " está disponivel para remover");
                                    }
                                }
                                else if (vez == "branca") {
                                    if (aux[0] < 3) {
                                        this.used_linha_branca[aux[2]] = false;
                                    }
                                    if (aux[1] < 3) {
                                        this.used_coluna_branca[aux[3]] = false;
                                    }
                                }


                            }
                        }
                        else {

                            console.log("Movimento escolhido inválido");
                            console.log("Selected div = " + selected_div.id);
                            console.log("Selected move = " + selected_move.id);
                            console.log("this.peca_selecionada_moveu = " + this.peca_selecionada_moveu)
                            console.log("Selected_move.classList.contains('peca_tabuleiro_preta') = " + selected_move.classList.contains('peca_tabuleiro_preta'));
                            console.log("Selected_move.classList.contains('peca_tabuleiro_branca') = " + selected_move.classList.contains('peca_tabuleiro_branca'));
                            console.log("!(this.Last_Move_branca[0] == to && this.Last_Move_branca[1] == from) = " + !(this.Last_Move_branca[0] == to && this.Last_Move_branca[1] == from));
                            console.log("!(this.Last_Move_preta[0] == to && this.Last_Move_preta[1] == from) = " + !(this.Last_Move_preta[0] == to && this.Last_Move_preta[1] == from));
                            console.log(this.tab);
                            DisplayMessage("Escolhe uma posição válida para mover a peça ")

                        }
                    }
                });
                parent.appendChild(child);
            }
        }
    }

    /*
    verifica se ao mover a peça para esta posição
    não quebra alguma regra (ex: mais de 3 peças contiguas
    da mesma cor)
    !Nota: não verifica se faz um movimento correto ,ou seja,
    ! se faz um movimento de uma só peça.Apenas verifica se é valido
    ! ter nessa posição uma peça
    */
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
                this.tab[to.id] = cor_peca;

                //Verifica se a posição é valida
                // let pos_valid = this.Posicao_valida(to.id, cor_peca);

                let coluna = this.coluna_aux(to.id, cor_peca);
                let linha = this.linha_aux(to.id, cor_peca);
                let t = Max_Pecas_continguas(linha, coluna, cor_peca, to.id, this.GamePhase,"");

                //Restauramos o tabuleiro para o estado "original"
                this.tab[from.id] = cor_peca;
                this.tab[to.id] = undefined;
                if (t[0] <= 3 && t[1] <= 3) {
                    // console.log("Max linha t[0] = " + t[0]);
                    // console.log("Max coluna t[1] = " + t[1]);
                    // console.log("(Antes movimento ) linha: " + linha);
                    // console.log("(Antes movimento ) coluna: " + coluna);
                    console.log("IS_VALID() = TRUE");
                    return true;
                }
                else {
                    console.log("IS_VALID() = FALSE");
                    return false;
                }
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

    //Começa o jog em si
    play(id_celula) {
        // Executa a função play com o id da div clicada
        //console.log("entrei no play");



        //Enquanto tem pecas para jogar
        if (this.nr_pecas_brancas != 0 || this.nr_pecas_pretas != 0) {
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

    async Move() {

        await sleep(100);

        //todo aqui temos de verificar se existem condições para acabar o jogo 
        if ((this.selected_a_piece == true || this.selected_a_piece == undefined) &&
            (this.peca_selecionada_moveu == true || this.peca_selecionada_moveu == undefined) &&
            (this.Eliminar_peca_resolvido == true || this.Eliminar_peca_resolvido == undefined)) {
            console.log("======ENTREI NA MOVE PHASE======");
            console.log("Próximo a mover : " + this.cur_playing);
            DisplayMessage("Proxima peça a mover : (" + this.cur_playing + ")");
            let cor_peca = this.cur_playing;
            if (this.cur_playing == "preta")
                this.cur_playing = "branca";
            else
                this.cur_playing = "preta";
            this.move_peca(cor_peca);
        }
    }

    async move_peca(cor_peca) {
        // usamos esta var , para ter uma variavel "global"
        //dentro deste bloco (para permitir que ao clicar
        //uma peça qualquer ela fique verdadeira)
        console.log("----------------INICIO--------------");
        var selected = false;

        //usamos para indicar se uma peça selecionada foi deesselecionada
        var unselected = false;

        await sleep(300);

        let pecas = undefined;
        if (cor_peca == "branca")
            pecas = document.querySelectorAll('div.peca_tabuleiro_branca');
        else
            pecas = document.querySelectorAll('div.peca_tabuleiro_preta');

        for (let peca of pecas) {
            //! IMPORTANTE
            //! o id da peça serve para depois 
            //! colocar em this.tab o movimento de peças
            //! que ocorreu
            //Adicionamos um evente as peças que podem 
            // se mover neste turno(caso seja clicada 
            //uma peca colocamos true na selected_a_piece
            //para garantir que esperamos que o utilizador
            //clique na peça)
            peca.onclick = function () {
                // unclick 
                if (this.classList.contains("selected")) {
                    console.log("UNCLICK");
                    console.log("esta peça já foi selecionada");
                    peca.classList.remove("selected");
                    peca.style["border-color"] = "grey";
                    unselected = true;
                }
                // click 
                else {
                    console.log("CLICK");
                    peca.style["border-color"] = "#60e550";
                    peca.classList.add("selected");
                    selected = true;
                }
            }
        }

        this.selected_a_piece = false;
        while (selected == false) {
            console.log("A ESPERA QUE SELECIONEM A PEÇA PARA MOVER " );

            await sleep(100);
        }
        console.log("SELECIONOU UMA PEÇA");
        this.selected_a_piece = true;


        //retira a possibilidade de selecionar das outras peças
        // para impedir que selecionemos mais do que uma peça
        restore(false);

        /*
        !Após selecionamento da peça
        */

        this.peca_selecionada_moveu = false;
        //Ciclo em baixo quebra quando movemos a peça para outra casa
        while (this.peca_selecionada_moveu == false) {
            //caso uma peça seja desselcionada
            if (unselected == true) {
                //! this.peca_selecionada_moveu = true;
                break;
            }
            console.log("A ESPERA MOVAM A PEÇA");
            await sleep(1000);
        }
        console.log("PEÇA MOVEU");
        /* 
        ! Depois de mover a peça
        */

        //Só faz isto caso a peça não tenha sido desselecionada        
        if (unselected == false) {

            //verifica se Após o movimento é possivel eliminar uma peça
            let selected_piece = document.querySelector('.selected');
            this.Eliminar_peca_resolvido = false;
            this.Eliminar_peca(selected_piece.parentElement.id, cor_peca);

            while (this.Eliminar_peca_resolvido == false) {
                // console.log("A ESPERA QUE REMOVAM PEÇA(MOVE PHASE)");
                await sleep(200);
            }


            console.log(this.tab);
        }
        else {
            //troca a vez do jogador , para depois ao chamar this.move
            // o mesmo troca novamento o jogador (basicamente permite
            // que o jogador que desselecionou uma peça jogue outra vez)
            if (this.cur_playing == "preta")
                this.cur_playing = "branca";
            else
                this.cur_playing = "preta";

            //pus aqui para tentar resolver o bug 
            this.peca_selecionada_moveu = true;
            //confirmar restore abaixo

        }

        // this.peca_selecionada_moveu = true;
        //! (CONFIRMAR) this.selected_a_piece = true;

        //retira a possibilidade de selecionar de todas as peças
        restore(true);


        //Chamamos o MOVE() outra vez no fim (se não chegamos ao fim do jogo)
        if (this.Chegou_ao_fim(this.dificulty) == false){
            console.log("----------------FIM-----------------");
            console.log("=====CHAMEI NOVAMENTE this.Move()=====")
            this.Move();
        }

    }

    //Serve como Drop_phase
    async por_peca(id_celula) {
        //Query que contem cada celula da tabela
        const posicoes = document.querySelectorAll(".item_tabuleiro");
        //Debug de consola

        for (let celula of posicoes) {
            let peca = document.createElement('div');

            //Entramos no if se a celula não tem peça dentro dela e tem
            //o respetivo id
            if (id_celula == celula.id && celula.childElementCount == 0) {

                //Jogam primeiro quem escolheu as peças pretas 
                if (this.nr_pecas_pretas >= this.nr_pecas_brancas) {

                    //Verifica se a posição é válida
                    if (this.Posicao_valida(celula.id, "preta") == true) {
                        //!Supondo que o jogador joga com as peças pretas
                        DisplayMessage("É a vez da peça branca jogar");

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

                        /* Ciclo para fazer debug, e esperar 3 segundos */
                        while (this.Eliminar_peca_resolvido == false) {
                            // console.log("A ESPERA QUE REMOVAM PEÇA");
                            await sleep(200);
                        }

                        //Verifica se o jogo terminou 
                    }
                    else {
                        DisplayMessage("So é possivel ter 3 peças contiguas de uma cor na mesma linha/coluna.Escolha uma jogada válida.");
                        // alert("POSIÇÃO INVALIDA: não é possivel ter mais de 3 peças contiguas na mesma linha ou coluna");
                    }
                }
                else {
                    //Verifica se a posição é válida
                    if (this.Posicao_valida(celula.id, "branca") == true) {
                        //?console.log("TESTE =>" + this.Posicao_valida(celula.id, "branca"));
                        //!Supondo que o oponente joga com as peças brancas
                        DisplayMessage("É a vez da peça preta jogar");

                        //Diminuimos o nr de peças brancas
                        this.nr_pecas_brancas--;

                        //Indicação da transição para a move phase
                        if (this.nr_pecas_brancas == 0 && this.nr_pecas_pretas == 0)
                            DisplayMessage("Clique no tabuleiro para passar para a Move Phase");

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
                            // console.log("A ESPERA QUE REMOVAM PEÇA")
                            await sleep(200);
                        }

                        //Verifica se o jogo terminou
                    }
                    else {
                        // alert("POSIÇÃO INVALIDA: não é possivel ter mais de 3 peças contiguas na mesma linha ou coluna");
                        DisplayMessage("POSIÇÃO INVALIDA: não é possivel ter mais de 3 peças contiguas na mesma linha ou coluna.Jogue novamente numa posição válida.");

                    }

                }
            }
            else if (id_celula == celula.id && celula.childElementCount != 0) {
                console.log("Celula está ocupada");
                // alert("Posição ocupada,por favor selecione uma posição vazia");
                DisplayMessage("POSIÇÃO INVALIDA: Posição ocupada,por favor selecione uma posição vazia.");
            }
        }
    }

    //Verifica se estamos em condições de elimar uma peça inimiga 
    //async (apenas permite implementar um sleep , que é utilizado
    // no ciclo while )
    async Eliminar_peca(Posicao, cor_peca) {
        let coluna = this.coluna_aux(Posicao, cor_peca);
        let linha = this.linha_aux(Posicao, cor_peca);
        //[Max_nr_peças_linha,Max_nr_peças_coluna
        //linha_no_tabuleiro_onde_ocorreu, 
        //coluna_no_tabuleiro_onde_ocorreu]
        let aux = Max_Pecas_continguas(linha, coluna, cor_peca, Posicao, this.GamePhase,"");

        //Se tivermos 3 peças contiguas ,de uma certa cor, numa linha ou coluna
        // que não tido usadas previamente podemos elimnar a peça
        let condition = undefined;
        if (cor_peca == "preta")
            condition = (aux[0] == 3 && this.used_linha_preta[aux[2]] == false) || (aux[1] == 3 && this.used_coluna_preta[aux[3]] == false)
        else if (cor_peca == "branca")
            condition = (aux[0] == 3 && this.used_linha_branca[aux[2]] == false) || (aux[1] == 3 && this.used_coluna_branca[aux[3]] == false)

        if (condition) {
            let peca_a_remover = "";
            switch (cor_peca) {
                case "preta":
                    peca_a_remover = "peca_tabuleiro_branca";
                    DisplayMessage("Foi feita uma linha e deve capturar uma peça Branca");
                    break;
                case "branca":
                    peca_a_remover = "peca_tabuleiro_preta";
                    DisplayMessage("Foi feita uma linha e deve capturar uma peça Preta");
                    break;
                default:
                    console.log("ERRO: em Eliminar_peca");
            }


            console.log("Podemos remover uma peça da cor " + peca_a_remover);
            

            //Guardamos todas as divs que correspondem as peças
            let divs = document.querySelectorAll('div.item_tabuleiro > div');

            // console.log(divs);
            //Percorre todas as peças e adiciona um evento de click
            //a cada peça que é possivel remover
            for (let peca of divs) {
                if (peca.className == peca_a_remover) {
                    peca.onclick = function () {
                        peca.parentNode.removeChild(peca);
                    }
                    peca.style["border-color"] = "red";
                }
            }
            let changed = document.querySelectorAll('div.item_tabuleiro > div');

            /* Guarda as posições de todas as peças (ANTES DE REMOVER) */
            let Save = new Array(changed.length).fill(0);
            let k = 0;
            for (let peca of changed) {
                Save[k] = peca.parentElement.id;
                k++;
            }
            //? console.log(Save);

            //fica a espera (neste caso 1 segundo) 
            //que seja removido algum elemento
            while (divs.length == changed.length) {
                // console.log("VERIFICA");
                await sleep(100);
                changed = document.querySelectorAll('div.item_tabuleiro > div');
            }

            /* Guarda as posições de todas as peças (DEPOIS DE REMOVER) */
            let Current = new Array(changed.length).fill(0);
            k = 0;
            for (let peca of changed) {
                Current[k] = peca.parentElement.id;
                k++;
            }
            //? console.log(Current);

            //Percorre todas as peças e remove o enventListner
            //para impedir que seja possivel remover mais peças
            for (let peca of divs) {
                if (peca.className == peca_a_remover) {
                    peca.style["border-color"] = "grey";
                    peca.onclick = function () { }
                }
            }
            console.log("Removeu a peça");

            //Verificamos se após remover uma peça 
            //uma linha ou coluna ficou sem 3 peças 
            //contíguas , se sim temos de por o used a false
            let Posicao_removida = findDifferentElement(Save, Current);
            console.log("Posição da peça removida = " + Posicao_removida);


            let cor_peca_removida = "";
            if (cor_peca == "preta")
                cor_peca_removida = "branca";
            else if (cor_peca == "branca")
                cor_peca_removida = "preta";

            //Colocar no tabuleiro a undefined a posição 
            // que foi removida
            this.tab[Posicao_removida] = undefined;


            let new_coluna = this.coluna_aux(Posicao_removida, cor_peca_removida);
            let new_linha = this.linha_aux(Posicao_removida, cor_peca_removida);
            console.log ("Line after removal = " +new_linha);
            console.log ("Colum aftre removal = "  + new_coluna);


            let teste = Max_Pecas_continguas(new_linha, new_coluna, cor_peca_removida, Posicao_removida, this.GamePhase,"removed");
            // ?console.log("(Pos : ["+ Posicao_removida+ "] : Max Peças contíguas " + cor_peca_removida + "s na linha = " + (teste[0]-1));
            // ?console.log("(Pos : ["+ Posicao_removida+ "] : Max Peças contíguas " + cor_peca_removida + "s na coluna = " + (teste[1]-1));

            //colocamos false nas linhas ou colunas
            //que deixarem de ter 3 peças contiguas
            //! Nota: temos que por -1 porque a função que retorna
            //! o máximo de peças contiguas , conta com a peça que foi removida
            //!(o que faz sentido na parte de colocar a peça mas neste caso
            //! não faz)

            console.log("Max BEFORE ("+cor_peca + ")= " + aux);
            console.log("Max AFTER (" + cor_peca_removida + ")= " +  teste );
            // caso nessa linha/coluna não tenha 3 de peças contíguas
            if (cor_peca_removida == "preta") {
                
                if (teste[0] < 3) {
                    this.used_linha_preta[teste[2]] = false;
                }
                if (teste[1] < 3) {
                    this.used_coluna_preta[teste[3]] = false;
                }
            }
            else if (cor_peca_removida == "branca") {
                if (teste[0] < 3) {
                    this.used_linha_branca[teste[2]] = false;
                }
                if (teste[1]  < 3) {
                    this.used_coluna_branca[teste[3]] = false;
                }
            }





            //Colocamos true na linha ou coluna que contem as 3 peças
            //contiguas

            if (cor_peca == "preta") {
                if (aux[0] == 3 && this.used_linha_preta[aux[2]] == false) {
                    this.used_linha_preta[aux[2]] = true;
                }
                if (aux[1] == 3 && this.used_coluna_preta[aux[3]] == false) {
                    this.used_coluna_preta[aux[3]] = true;
                }
            }
            else if (cor_peca == "branca"){
                if (aux[0] == 3 && this.used_linha_branca[aux[2]] == false){
                    this.used_linha_branca[aux[2]] = true;
                }
                if (aux[1] == 3 && this.used_coluna_branca[aux[3]] == false) {
                    this.used_coluna_branca[aux[3]] = true;
                }
            }


            console.log("Removeu a peça");
            console.log("Estado da linha used PRETA = " + this.used_linha_preta);
            console.log("Estado da coluna used PRETA = " + this.used_coluna_preta);
            console.log("Estado da linha used BRANCA = " + this.used_linha_branca);
            console.log("Estado da coluna used BRANCA = " + this.used_coluna_branca);
            // console.log("Estado da linha used = " + this.used_linha_preta);
            // console.log("Estado da coluna used = " + this.used_coluna_preta);

            /*parte das mensagens*/
            if (cor_peca == "preta")
                DisplayMessage("É a vez da peça branca jogar");
            else if (cor_peca == "branca")
                DisplayMessage("É a vez da peça preta jogar");

        }
        //
        else {
            //verifica se alguma linha ou coluna tem menos de 3 peças contiguas
            //se sim atualiza this.used_(...) para false
            console.log("Nao existe condições para remover");
            console.log("Estado da linha used PRETA = " + this.used_linha_preta);
            console.log("Estado da coluna used PRETA = " + this.used_coluna_preta);
            console.log("Estado da linha used BRANCA = " + this.used_linha_branca);
            console.log("Estado da coluna used BRANCA = " + this.used_coluna_branca);


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

        let peca_contiguas = Max_Pecas_continguas(cur_linha, cur_coluna, cor_peca, Posicao, this.GamePhase,"");

        //condição que aplicamos na dropphase 
        if (peca_contiguas[0] <= 3 && peca_contiguas[1] <= 3)
            return true;
        else {
            return false;
        }
    }


    Chegou_ao_fim(nivel_do_IA) {
        console.log("Entrei no chegou_ao_fim");
        //Lista com as peças de cada cor 
        let pecas_brancas = document.querySelectorAll("div.item_tabuleiro > div.peca_tabuleiro_branca"); 
        let pecas_pretas = document.querySelectorAll("div.item_tabuleiro > div.peca_tabuleiro_preta"); 
    
        // nr de peças brancas atualmente no tabuleiro
        let nr_brancas = pecas_brancas.length;
        let nr_pretas = pecas_pretas.length;
    
        //Se já não tiver mais peças para jogar 
        //verifico se alguma das cores só tem duas peças (Fim de jogo)
        if (nr_brancas < 3) {
            console.log("Peças pretas Ganham ");
            Update_score(nivel_do_IA, "preta");
            DisplayMessage("Peças pretas  Ganharam!!!");
            return true;
        }
        else if (nr_pretas < 3) {
            console.log("Peças brancas Ganham ");
            Update_score(nivel_do_IA, "branca");
            DisplayMessage("Peças brancas Ganharam!!!");
            return true;
        }
    
        console.log(pecas_brancas);
        console.log(pecas_pretas);

        //Pomos a verdadeiro (mas se econtramos algum movimento valido para
        //qualquer peça no ciclo abaixo pomos a false)
        let branca_perdeu = true;
        let preta_perdeu = true;

        //ciclo que quebra mal encontre um movimento válido (peças brancas)
        loop1 : for (let peca of pecas_brancas){
            let from = peca.parentElement.id;
            // [cima,baixo,direita,esquerda]
            let direction = [from-this.cols,
                parseInt(from) + parseInt(this.cols),
                parseInt(from) + 1,
                parseInt(from) - 1
                ]
            for (let d of direction){
                //restrições relacionadas com tabuleiro
                if (d > 0 && d <= this.cols*this.cols && 
                    !(from % this.cols == 0 && (d-1) % this.cols ==0) &&
                    !((from-1) % this.cols == 0 && d % this.cols == 0) && 
                    this.is_valid(from,d)
                    ){
                    console.log("DENTRO TABULEIRO(" + from + "->" + d +")");
                    // console.log("DENTRO TABULEIRO(" + from + "->" + d +" = " + this.is_valid(from,d) +")");
                    branca_perdeu = false;
                    break loop1;
                }
                else {
                    //?console.log ("FORA TABULEIRO (" + from + "->" + d + ")");
                }
            }
        }

        if (branca_perdeu == true){
            console.log("Peças pretas Ganham (Peças brancas não tem movimentos válidos)");
            Update_score(nivel_do_IA, "preta");
            DisplayMessage("Peças pretas  Ganharam(Peças brancas não tem movimentos válidos)!!!");
            return true;
        }
        
        //ciclo que quebra mal encontre um movimento válido (peças pretas)
        loop2 : for (let peca of pecas_pretas){
            let from = peca.parentElement.id;
            // [cima,baixo,direita,esquerda]
            let direction = [from-this.cols,
                parseInt(from) + parseInt(this.cols),
                parseInt(from) + 1,
                parseInt(from) - 1
                ]
            for (let d of direction){
                //restrições relacionadas com tabuleiro
                if (d > 0 && d <= this.cols*this.cols && 
                    !(from % this.cols == 0 && (d-1) % this.cols ==0) &&
                    !((from-1) % this.cols == 0 && d % this.cols == 0) && 
                    this.is_valid(from,d)
                    ){
                    console.log("DENTRO TABULEIRO(" + from + "->" + d +")");
                    // console.log("DENTRO TABULEIRO(" + from + "->" + d +" = " + this.is_valid(from,d) +")");
                    preta_perdeu = false;
                    break loop2;
                }
                else {
                    //?console.log ("FORA TABULEIRO (" + from + "->" + d + ")");
                }
            }
        }

        if (preta_perdeu == true){
            console.log("Peças brancas Ganham (Peças pretas não tem movimentos válidos)");
            Update_score(nivel_do_IA, "branca");
            DisplayMessage("Peças brancas Ganharam(Peças pretas não tem movimentos válidos)!!!");
            return true;
        }




    
    
    
        return false;
    }



    


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

function remove(parent) {
    let aux = document.getElementById(parent);
    console.log("Remove filho de " + aux.id)
    aux.removeChild(aux.firstChild);

}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

//dado uma posição no tabuleiro indica a linha a que
//essa posição pertence
function getLinha(Posicao, cols) {
    let aux = Posicao;
    let linha = 1;
    while (aux > 0) {
        aux -= cols;
        if (aux <= 0)
            break;
        linha++;
    }
    return linha;
}

//dado uma posição no tabuleiro indica a coluna a que essa posição pertence 
function getColuna(Posicao, cols) {
    let indice_inicial = 0;
    let indice_final = 0;
    let aux = Posicao;
    while (parseInt(aux) % cols != 0) {
        aux++;
    }
    indice_final = aux;
    indice_inicial = aux - cols + 1;
    // console.log("["+indice_inicial+","+indice_final+"]");

    let ans = 1;
    for (let i = indice_inicial; i <= indice_final; i++) {
        if (i == Posicao)
            return ans;
        ans++;
    }

    alert("ERRO na função getColuna");
}

/* FUNCÃO DE DISPLAY DE MENSAGENS*/
function DisplayMessage(message) {
    const message_div = document.getElementById("mensagens_ui");
    // console.log(message_div);
    const first_child = message_div.firstChild;
    first_child.textContent = message;
}

//Verifica o numero de peças contiguas da mesma cor ao inserir a peça nesta posição
//e retorna um array 
//[Max_pecas_contíguas_linha,Max_pecas_contíguas_coluna
//,linha_no_tabuleiro_onde_ocorreu,coluna_no_tabuleiro_onde_ocorreu] 
function Max_Pecas_continguas(linha, coluna, cor_peca, Posicao, GamePhase,removed) {
    let cols = linha.length - 1;
    // console.log("Dentro de Max");
    //? console.log("Posicao " + Posicao + " pertence a linha " + getLinha(Posicao,cols) + " e coluna "+  getColuna(Posicao,cols));

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
    let nr_pecas_linha = Biggest_sequence(linha, cor_peca, pos_col_on_array, GamePhase,removed);
    let nr_pecas_coluna = Biggest_sequence(coluna, cor_peca, pos_row_on_array, GamePhase,removed);
    // console.log("linha = " + linha);
    console.log("maior numero de peças (" + cor_peca + "s) contiguas nesta LINHA = " + nr_pecas_linha);
    // console.log("coluna = "+ coluna);
    console.log("maior numero de peças (" + cor_peca + "s) contiguas nesta COLUNA = " + nr_pecas_coluna);


    //Jogada valida (nao tem mais de 3 peças da mesma cor contiguas)
    if (nr_pecas_linha <= 3 && nr_pecas_coluna <= 3)
        return [nr_pecas_linha, nr_pecas_coluna, getLinha(Posicao, cols), getColuna(Posicao, cols)];
    else {
        console.log("JOGADA INVALIDA: não podemos ter mais de 3 peças contiguas da mesma cor (vertical ou horizontal)");
        //Adicionamos o 3 parametro a false para garantir que 
        //é explicito que não valido o jogador ganhar
        return [nr_pecas_linha, nr_pecas_coluna, false];
    }
}

//retorna qual e a maior sequencia simultânea de pecas com a mesma cor
function Biggest_sequence(seq, cor_peca, pos, GamePhase,removed) {
    let ans = 0;
    let cur_max = 0
    // console.log("Dentro Biggest");
    //!colocamos la a peça se nãotivermos na move phase
    // console.log("Sequencia("+cor_peca  + ") = " + seq);

    if (GamePhase != "MovePhase" && removed != "removed") 
        seq[pos] = cor_peca;
    // console.log("Sequencia("+cor_peca  + ") = " + seq);

    //ciclo que procura a maior sequencia de peças com a cor == cor_peca
    for (let i = 1; i < seq.length; i++) {
        // console.log("seq["+i+ "]="+seq[i]);
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
    // console.log("Sequencia("+cor_peca  + ") = " + seq);
    // console.log("Maior sequencia contígua de peças da cor " + cor_peca + " = " + ans);
    //!retiramos a peça colocada 
    if (GamePhase != "MovePhase" && removed != removed)
        seq[pos] = undefined;

    return ans;
}

//Garantidamente o array 1 é > que o array2
// e que tem pelo menos um elemento diferente
function findDifferentElement(array1, array2) {
    // Itera sobre os dois arrays
    for (let i = 0; i < array1.length; i++) {
        // Se o elemento em uma posição for diferente, retorna esse elemento
        if (array1[i] !== array2[i]) {
            return array1[i];
        }
    }
    //caso especial em que o ultimo elemento 
    //é o elemento diferente
    return array1[array1.length - 1];

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
    tabuleiro = new Tabuleiro("tabuleiro", selector_linhas.value, selector_colunas.value, get_dificulty());
     //A frase que explica o estado do jogo passa a ser vísivel depois da criação do tabuleiro
     let mensagem = document.getElementById("mensagens_ui");
     mensagem.style.visibility = "visible";
     mensagem.style.justifyContent = "center";
     let container_v4 = document.getElementById("container_v4");
     container_v4.style.visibility = "visible";

    //mensagem de inicio de jogo
    DisplayMessage("É a vez da peça preta jogar");

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
        if (i == 3)
            radiobutton.checked = "checked";
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

//Vai buscar a dificuldade assim que clicamos no botão de começar o jogo
function get_dificulty() {
    let fieldset = document.getElementById('escolha_dificuldade');

    let button_selected = fieldset.querySelector('input[type="radio"]:checked');
    // console.log(fieldset);
    console.log(button_selected.value[12]);
    return button_selected.value[12];

}

//Função que atualiza a tabela de scores
function Update_score(nivel_do_IA, vencedor) {
    //caso preça preta  (jogador) ganhe
    let v = "numero_vitorias_" + nivel_do_IA;
    //caso preça branca (computador) ganhe
    let d = "numero_derrotas_" + nivel_do_IA;

    let score = document.getElementById("classificacao");
    console.log(score);
    console.log(v);
    console.log(d);

    if (vencedor == "preta") {
        let aux = document.getElementById(v);
        let cur_value = parseInt(aux.innerHTML) + 1;
        aux.innerHTML = cur_value;
    }
    else if (vencedor == "branca") {
        let aux = document.getElementById(d);
        let cur_value = parseInt(aux.innerHTML) + 1;
        aux.innerHTML = cur_value;
    }
}

//Função de desistir (neste caso só o jogador pode desistir )
async function give_up() {
    console.log("Carreguei no botão");
    let dif = get_dificulty();
    Update_score(dif, "branca");

    DisplayMessage("Jogador desistiu !!!");

    await sleep(1000);

    //Cria um novo tabuleiro 
    get_nr_linhas_colunas();
}


//O que é carregado no inicio
window.onload = function () {
    console.log("Carregou a Dom");
    displayRadioValue()
}