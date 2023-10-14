window.onload = function () {
    console.log("Dom");
    let selector_linhas = document.querySelector('#input_linhas_tabuleiro');

    let selector_colunas = document.querySelector('#input_colunas_tabuleiro');

    tabuleiro = new Tabuleiro("tabuleiro", selector_linhas.value, selector_colunas.value);
}

/* FUNCÃO DE DISPLAY DE MENSAGENS*/

function DisplayMessage (message){
    const message_div = document.getElementById("mensagens_ui");
    console.log(message_div);
    const first_child = message_div.firstChild;
    first_child.textContent = message;
}

/* FIM FUNCÃO DE DISPLAY DE MENSAGENS*/

class Tabuleiro {
    //"variaveis estaticas" que permitem guardar o numero de peças brancas e pretas
    nr_pecas_brancas = 12;
    nr_pecas_pretas = 12;
    //Numero de linhas e colunas
    rows = 0;
    cols = 0;
    //Array booleano que contem as linhas/colunas com 3 peças
    //contiguas da mesma cor
    used_linha = undefined;
    used_coluna = undefined;

    constructor(parentid, rows, cols) {
        let parent = document.getElementById(parentid);

        //Inicializamos as variaveis da classe
        this.rows = rows;
        this.cols = cols;
        this.used_linha = new Array(parseInt(rows) + 1).fill(false);  //indice começa em 1
        this.used_coluna = new Array(parseInt(cols) + 1).fill(false);

        console.log(this.used_linha);
        console.log(this.used_coluna);

        //Representamos o tabuleiro como matriz (com indice que começa em 1)
        this.tab = new Array(rows * cols + 1);
        this.tab[0] = "NULL";

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

    }

    play(id_celula) {
        // Executa a função play com o id da div clicada
        // console.log("Jogo começou");
        // console.log(this.tab);

        if (this.nr_pecas_brancas != 0 || this.nr_pecas_pretas != 0){
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
            console.log("TODO: Implementar a move phase")
            //TODO testar a ver se funciona
            this.Chegou_ao_fim();
        }
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

                        //!Supondo que o jogador joga com as peças pretas
                        DisplayMessage("É a vez do oponente  de pôr uma peça");

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
                        while (this.Eliminar_peca_resolvido == false){
                            // console.log("A ESPERA QUE REMOVAM PEÇA");
                            await sleep(3000);
                        }


                        //Verifica se o jogo terminou
                        this.Chegou_ao_fim()

                    }
                    //Se for inválida manda um alert 
                    else {
                        DisplayMessage("POSIÇÃO INVALIDA: não é possivel ter mais de 3 peças contiguas na mesma linha ou coluna.Jogue novamente numa posição válida.");
                        // alert("POSIÇÃO INVALIDA: não é possivel ter mais de 3 peças contiguas na mesma linha ou coluna");

                    }
                }
                else {

                    //Verifica se a posição é válida
                    if (this.Posicao_valida(celula.id, "branca") == true) {
                        //?console.log("TESTE =>" + this.Posicao_valida(celula.id, "branca"));

                        //!Supondo que o jogador joga com as peças brancas
                        DisplayMessage("É a vez do jogador de pôr uma peça");


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
                        while (this.Eliminar_peca_resolvido == false){
                            console.log("A ESPERA QUE REMOVAM PEÇA")
                            await sleep(1000);
                        }

                        //Verifica se o jogo terminou
                        this.Chegou_ao_fim()
                    }
                    //Se for inválida manda um alert
                    else {
                        // alert("POSIÇÃO INVALIDA: não é possivel ter mais de 3 peças contiguas na mesma linha ou coluna");
                        DisplayMessage("POSIÇÃO INVALIDA: não é possivel ter mais de 3 peças contiguas na mesma linha ou coluna.Jogue novamente numa posição válida.");

                    }

                }

                // console.log("Número atual de peças brancas:" + this.nr_pecas_brancas);
                // console.log("Número atual de peças pretas:" + this.nr_pecas_pretas);
            }
            else if (id_celula == celula.id && celula.childElementCount != 0) {
                console.log("Celula está ocupada");
                // alert("Posição ocupada,por favor selecione uma posição vazia");
                DisplayMessage("POSIÇÃO INVALIDA: Posição ocupada,por favor selecione uma posição vazia.");

            }

        }

    }

    //Verifica se jogo terminou ,se sim 
    //retorna [possivel_acabar,quem_ganha]

    Chegou_ao_fim(){
        // console.log("Entrei no chegou_ao_fim");
        
        //Guarda o nr de peças brancas atualmente no tabuleiro
        let nr_brancas = document.querySelectorAll("div.item_tabuleiro > div.peca_tabuleiro_branca").length;
        let nr_pretas = document.querySelectorAll("div.item_tabuleiro > div.peca_tabuleiro_pretas").length;

        //Se já não tiver mais peças para jogar 
        if (this.nr_pecas_brancas == 0 && this.nr_pecas_pretas){
            //verifico se alguma das cores só tem duas peças (Fim de jogo)
            if (nr_brancas < 3 ){   
                console.log("Peças pretas Ganham ");
            }
            else if (nr_pretas < 3){
                console.log("Peças brancas Ganham ");
            }
            console.log(this.nr_pecas_brancas);
        }

        //Guarda todas as divs que contêm peças
        let celulas_ocupadas = document.querySelectorAll("div.item_tabuleiro > div");

        //todo Implementar o resto 
        // console.log(celulas_ocupadas);

        

                

    }




    //Verifica se estamos em condições de elimar uma peça inimiga 
    //async (apenas permite implementar um sleep , que é utilizado
    // no ciclo while )
    async Eliminar_peca(Posicao, cor_peca) {
        let coluna = this.coluna_aux(Posicao,cor_peca);
        let linha = this.linha_aux(Posicao,cor_peca);
        //[Max_nr_peças_linha,Max_nr_peças_coluna
        //linha_no_tabuleiro_onde_ocorreu, 
        //coluna_no_tabuleiro_onde_ocorreu]
        let aux = Max_Pecas_continguas(linha,coluna,cor_peca,Posicao);

        //Se tivermos 3 peças contiguas numa linha ou coluna
        // que não tido usadas previamente podemos elimnar a peça

        if ((aux[0] ==3 && this.used_linha[aux[2]] == false) ||
         (aux[1] == 3 && this.used_coluna[aux[3]] == false)){

            DisplayMessage("Foi feita uma linha e deve capturar uma peça do adversário");
            let peca_a_remover = "";
            switch (cor_peca){
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

            // console.log(divs);
            //Percorre todas as peças e adiciona um evento de click
            //a cada peça que é possivel remover
            for (let peca of divs){
                if (peca.className == peca_a_remover){
                    peca.addEventListener('click', function() {
                        // Adicionamos um evento a cada filho
                        peca.parentNode.removeChild(peca);

                    });
                    peca.style["border-color"] = "#60e550";
                }
            }
            let changed = document.querySelectorAll('div.item_tabuleiro > div');

           /* Guarda as posições de todas as peças (ANTES DE REMOVER) */
            let Save = new Array(changed.length).fill(0);
            let k = 0;
            for (let peca of changed){
                Save[k] = peca.parentElement.id;
                k++;
            }
            //? console.log(Save);


            //fica a espera (neste caso 1 segundo) 
            //que seja removido algum elemento
            while (divs.length == changed.length){
                // console.log("VERIFICA");
                await sleep(1000);
                changed = document.querySelectorAll('div.item_tabuleiro > div');     
            }

            /* Guarda as posições de todas as peças (DEPOIS DE REMOVER) */
            let Current = new Array(changed.length).fill(0);
            k = 0;
            for (let peca of changed){
                Current[k] = peca.parentElement.id;
                k++;
            }
            //? console.log(Current);



            //Percorre todas as peças e remove o enventListner
            //para impedir que seja possivel remover mais peças
            for (let peca of divs){
                if (peca.className == peca_a_remover){
                    peca.style["border-color"] = "grey";
                    peca.replaceWith(peca.cloneNode(true));
                }
            }

            //Verificamos se após remover uma peça 
            //uma linha ou coluna ficou sem 3 peças 
            //contíguas , se sim temos de por o used a false
            let Posicao_removida = findDifferentElement(Save,Current);
            console.log("Posição da peça removida = "+ Posicao_removida);

            
            let cor_peca_removida ="";
            if (cor_peca == "preta")
                cor_peca_removida = "branca";
            else if (cor_peca == "branca")
                cor_peca_removida = "preta";

            //Colocar no tabuleiro a undefined a posição 
            // que foi removida
            this.tab[Posicao_removida] = undefined;


            let new_coluna = this.coluna_aux(Posicao_removida,cor_peca_removida);
            let new_linha = this.linha_aux(Posicao_removida,cor_peca_removida);
            //?console.log (new_linha);
            //?console.log (new_coluna);


            let teste = Max_Pecas_continguas(new_linha,new_coluna,cor_peca_removida,Posicao_removida);
            // ?console.log("(Pos : ["+ Posicao_removida+ "] : Max Peças contíguas " + cor_peca_removida + "s na linha = " + (teste[0]-1));
            // ?console.log("(Pos : ["+ Posicao_removida+ "] : Max Peças contíguas " + cor_peca_removida + "s na coluna = " + (teste[1]-1));

            //colocamos false nas linhas ou colunas
            //que deixarem de ter 3 peças contiguas
            //! Nota: temos que por -1 porque a função que retorna
            //! o máximo de peças contiguas , conta com a peça que foi removida
            //!(o que faz sentido na parte de colocar a peça mas neste caso
            //! não faz)

            // caso nessa linha não tenha 3 de peças contíguas
            if(teste[0]-1 < 3 ){
                this.used_linha[teste[2]] = false;
            }
            //caso nessa coluna não tenha 3 peças contíguas
            if(teste[1]-1 < 3){
                this.used_coluna[teste[3]] = false;
            }




            //Colocamos true na linha ou coluna que contem as 3 peças
            //contiguas

            if (aux[0] == 3 && this.used_linha[aux[2]] == false){
                this.used_linha[aux[2]] = true;
            }
            else if (aux[1] == 3 && this.used_coluna[aux[3]] == false){
                this.used_coluna[aux[3]] = true;
            }
            console.log("Removeu a peça");    
            console.log("Estado da linha used = " + this.used_linha);
            console.log("Estado da coluna used = " + this.used_coluna);

            /*parte das mensagens*/
            if (cor_peca == "preta")
                DisplayMessage("É a vez do oponente de pôr uma peça");
            else if (cor_peca == "branca")
                DisplayMessage("É a vez do jogador de pôr uma peça");
                

        }
        //
        else {
        }

        //Para indicar em por_peça que a execução pode continuar
        this.Eliminar_peca_resolvido = true;
        //Parte de retornar um Promise 
        /*
        return new Promise((resolve,reject) => {
            //Código retorna o valor da promise
            resolve(true);
        });
        */
    }






    //todo TER CUIDADO COM ESTAS DEFINIÇÕES de
    //todo Outofbounds (TESTAR MAIS PARA VER SE ESTÃO CERTAS)

    //mover a peça para célula direita
    RightOutofbounds(cur_pos) {
        //verificar se a deslocação atual sai do Tabuleiro 
        cur_pos = parseInt(cur_pos);
        let desl = 1;

        //Deslocamentos "positivos" nas colunas
        let aux = cur_pos;

        while (aux > this.cols) {
            aux -= this.cols;
        }
        if (aux + desl > this.cols) {
            console.log("deslocação de " + cur_pos + " para " + (cur_pos + desl) + " sai fora do tabuleiro");
            return true;
        }

        return false;
    }

    //mover a peça para célula esquerda

    LeftOutofbounds(cur_pos) {
        cur_pos = parseInt(cur_pos);
        let desl = 1;
        //Deslocamentos "negativos" nas colunas
        if (cur_pos - desl == 0 || (cur_pos - desl) % this.cols == 0) {
            console.log("deslocação de " + cur_pos + " para " + (cur_pos - desl) + " sai fora do tabuleiro");
            return true;
        }
        return false;

    }

    //mover a peça para célula acima
    UpOutofbounds(cur_pos) {
        cur_pos = parseInt(cur_pos);
        console.log(cur_pos - this.cols);
        if (cur_pos - this.cols <= 0) {
            console.log("deslocação de " + cur_pos + " para " + (cur_pos - this.cols) + " sai fora do tabuleiro");
            return true;
        }
        return false;
    }

    //mover a peça para célula abaixo
    DownOutofbounds(cur_pos) {
        cur_pos = parseInt(cur_pos);
        console.log(cur_pos + parseInt(this.cols));
        if (cur_pos + parseInt(this.cols) > this.rows * this.cols) {
            console.log("deslocação de " + cur_pos + " para " + (cur_pos + parseInt(this.cols)) + " sai fora do tabuleiro");
            return true;
        }
        return false;
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




function sleep(time) { 
    return new Promise((resolve) => setTimeout(resolve, time)); 
} 
    

//dado uma posição no tabuleiro indica a linha a que
//essa posição pertence
function getLinha(Posicao,cols){
    let aux = Posicao;
    let linha =1;
    while (aux > 0){
        aux-=cols;
        if (aux <=0)
            break;
        linha++;
    }
    return linha;
}

//dado uma posição no tabuleiro indica a coluna a que 
//essa posição pertence
function getColuna(Posicao,cols){
    let indice_inicial = 0;
    let indice_final = 0;
    let aux = Posicao;
    while (parseInt(aux) % cols != 0){
        aux++;
    }
    indice_final = aux;
    indice_inicial = aux-cols+1;
    // console.log("["+indice_inicial+","+indice_final+"]");

    let ans = 1;
    for (let i = indice_inicial ; i <= indice_final ; i++){
        if (i == Posicao)
            return ans;
        ans++;
    }

    alert("ERRO na função getColuna");
}



//Verifica o numero de peças contiguas da mesma cor ao inserir a peça nesta posição
//e retorna um array 
//[Max_pecas_contíguas_linha,Max_pecas_contíguas_coluna
//,linha_no_tabuleiro_onde_ocorreu,coluna_no_tabuleiro_onde_ocorreu] 
function Max_Pecas_continguas(linha, coluna, cor_peca, Posicao) {
    let cols = linha.length - 1;
    // console.log("cur cols = " + cols);
    
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
    let nr_pecas_linha = Biggest_sequence(linha, cor_peca, pos_col_on_array);
    let nr_pecas_coluna = Biggest_sequence(coluna, cor_peca, pos_row_on_array);
    //? console.log("maior numero de peças (" + cor_peca + "s) contiguas nesta LINHA = " + nr_pecas_linha);
    //? console.log("maior numero de peças (" + cor_peca + "s) contiguas nesta COLUNA = " + nr_pecas_coluna);


    //Jogada valida (nao tem mais de 3 peças da mesma cor contiguas)
    if (nr_pecas_linha <= 3 && nr_pecas_coluna <= 3)
        return [nr_pecas_linha, nr_pecas_coluna,getLinha(Posicao,cols),getColuna(Posicao,cols)];
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
    return array1[array1.length-1];
    
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
