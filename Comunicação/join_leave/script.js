// console.log("teste");

const url = "http://twserver.alunos.dcc.fc.up.pt:8008/";


function getUsername(){
    let aux = document.querySelector('#username');
    return aux.value;
}
function getPassword(){
    let aux = document.querySelector('#password');
    return aux.value;
}


//guarda em variaveis globais o nick e password do utilizador que fez register
var cur_user;
var pass;
function SaveCredantials(json,nick,password){
    if (JSON.stringify(json) == "{}"){
        cur_user = nick;
        pass = password;
        console.log("Registado com sucesso");
    }
    else {
        cur_user = undefined;
        pass = undefined;
    }
    // console.log(json);
    // console.log(nick);
    // console.log(password);
}

function register(){
    let user = getUsername();
    let pass = getPassword();
   
    let obj = {
        nick : user,
        password : pass 
    };

    let body = JSON.stringify(obj);

    console.log(body);
    fetch(url+"register",{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body:body
    })    
       .then(response => response.json())
       .then(json=>SaveCredantials(json,user,pass))
       .catch(console.log);
}


//guarda em variavel global a string associada ao utilizador registado
var game_session;
function SaveGameSession(json){
    console.log("Dentro de SaveGameSession");
    console.log(json);
    game_session = json.game;
}

//Emparelhe 2 jogadores
function join(){

    //caso utilizador registado seja invalido
    if (cur_user == undefined || pass == undefined){
        console.log("ERRO:Registe um utilizador válido");
    }
    //caso utilizador registado seja invalido
    else{
        //todo: atualizar as rows e cols com aquelas presentes no tabuleiro
        let obj = {
            "group" : 7,
            nick : cur_user,
            password : pass,
            "size" :{
                "rows" : 6,
                "columns" :5
            }
        }

        let body = JSON.stringify(obj);
        console.log(body);

        fetch(url+"join",{
            method: 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body:body
        })
          .then(response => response.json())
          .then(json => SaveGameSession(json))
          .then(console.log);

    }
}





//leave 
/*
Primeiro caso: Se for invocada durante o emparelhamento, enquanto espera por outros jogador, então não tem consequências
todo Segundo caso: Se o jogo já tiver em curso, a saída com este método concede a vitória ao adversário.
todo Terceiro caso:  Se uma jogada não for realizada no tempo devido(2min) então é executado um leave automático, nas condições descritas no parágrafo anterior
*/
function leave(){
    if (game_session == undefined){
        console.log("ERRO:Faça join , para começar a procura por um jogo");          
        return;
    }
    //caso utilizador registado seja invalido
    if (cur_user == undefined || pass == undefined){
        console.log("ERRO:Registe um utilizador válido");
    }
    
    //caso utilizador registado seja invalido
    else {
        let obj = {
            nick : cur_user,
            password: pass,
            game:game_session
        }
        
        let body = JSON.stringify(obj);
        console.log(body);

        fetch(url+"leave",{
            method: 'POST',
            headers : {
                'Content-type' :  'application/json'
            },
            body:body
        })
          .then(response => response.json())
          .then(game_session = undefined)
          .then(console.log);
         
    }
}