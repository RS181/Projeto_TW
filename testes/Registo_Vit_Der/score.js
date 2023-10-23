window.onload = function () {
    console.log("Carregou a Dom");
    get_dificulty();
}

//Função que atualiza a tabela de scrolls
function Update_score(nivel_do_IA,vencedor){
    //caso preça preta  (jogador) ganhe
    let v = "numero_vitorias_" + nivel_do_IA;
    //caso preça branca (computador) ganhe
    let d = "numero_derrotas_" + nivel_do_IA;

    let score = document.getElementById("classificacao");
    console.log(score);
    console.log(v);
    console.log(d);

    if (vencedor == "preta"){
        let aux = document.getElementById(v);
        let cur_value = parseInt(aux.innerHTML) +1;
        aux.innerHTML = cur_value;
    }
    else if (vencedor == "branca"){
        let aux = document.getElementById(d);
        let cur_value = parseInt(aux.innerHTML) +1;
        aux.innerHTML = cur_value;
    }
}

//Função que vai buscar a dificuldade
//todo (falta associar a peça que é a jogar)
function get_dificulty(){
    var ele = document.getElementsByTagName('input');
    console.log(ele);

    let dificuldade =0;
    for ( let i = 0 ; i < ele.length ; i++){
        if (ele[i].type == "radio" && ele[i].checked){
            // console.log("Name = " + ele[i].name);
            console.log("Value = " + ele[i].value[12]);
            dificuldade = ele[i].value[12];   
            break;
        }
    }

    Update_score(dificuldade,"branca");    

}

