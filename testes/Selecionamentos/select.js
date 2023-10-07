
function displayRadioValue(){
    let x = document.getElementById("Mostrar");
    var ele = document.getElementsByName('Checkgroup_escolha_jogador');
    for (i = 0; i < ele.length; i++) {
        if (ele[i].value=="escolha_computador" && ele[i].checked==true){
            console.log("Escolheu computador");
            create(x.id);
        }
        else {
            console.log("Escolheu jogador");
            removeAllChildNodes(x);
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
function create(parentid){
    let parent = document.getElementById(parentid);

    removeAllChildNodes(parent);

    parent.className = "item";
    //criamos uma div ao elemento com o id parentid
    //criamos um fieldset com respetivas legendas
    let fieldset = document.createElement("fielset")
    let legend = document.createElement("legend");
    

    //Colocamos as propriedades
    legend.innerText = "Indique a dificuldade da Ia";



    //Fazemos os appends de filhos do "mais velho" ao "mais novo"
    parent.appendChild(fieldset);
    fieldset.appendChild(legend);
    
//criação dos radiobutton da dificuldade
for (let i = 1 ; i <=5 ; i++){
    let radiobutton = document.createElement("input");
    radiobutton.id ="radio" + i;
    radiobutton.type = "radio";
    radiobutton.name ="teste";
    radiobutton.className = "destacar"
    // radiobutton.name = "Checkgroup_escolha_jogador";
    fieldset.appendChild(radiobutton);

    //criação do label para o radiobutton
    let label = document.createElement("label");
    label.textContent = ""+ i;
    label.htmlFor = "radio" + i;
    fieldset.appendChild(label);
}
}


//Carrega a pagina
window.onload = function(){
    console.log("Dom");
    //create(test);
    displayRadioValue();
}