
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
            create(x.id , "jogador");
        }
        // console.log(ele[i].value + "=" + ele[i].checked);
    }

}


//Função que remove todos os filhos de um pai
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


//Função que cria o novo div
function create(parentid, oponente) {
    console.log("Oponente: " + oponente);
    let parent = document.getElementById(parentid);

    removeAllChildNodes(parent);

    if (oponente == "computador")
        create_div_Computer(parentid);
    else if (oponente == "jogador")
        create_div_Player(parentid)

}


//Função que cria a div que contém a escolha de dificuldade
function create_div_Computer(parentid){
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
        radiobutton.value = "dificuldade_"+i;
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
function create_div_Player(parentid){
    console.log("In create_div_Player")
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
   for (let i = 1; i <=2 ; i++){
        let radiobutton = document.createElement("input");
        let label = document.createElement("label");

        radiobutton.id = "radio" + i;
        radiobutton.type = "radio";
        radiobutton.name = "teste";
        label.htmlFor = "radio"+1;


        fieldset.appendChild(radiobutton);
        fieldset.appendChild(label);


        //criação do label para o radiobutton
        if (i == 1){
            label.textContent = "Jogador";
            radiobutton.value = "jogador_joga_primeiro";
        }
        else {
            label.textContent = "Oponente";
            radiobutton.value = "oponente_joga_primeiro";

        }
   }



}

//Carrega a pagina
window.onload = function () {
    console.log("Dom");
    //create(test);
    displayRadioValue();
}