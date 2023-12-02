const url = "http://localhost:8008/"


function getUsername() {
    let aux = document.querySelector('#username');
    return aux.value;
}
function getPassword() {
    let aux = document.querySelector('#password');
    return aux.value;
}
//guarda em variaveis globais o nick e password do utilizador que fez register
var cur_user;
var pass;
function SaveCredantials(json, nick, password) {
    if (JSON.stringify(json) == "{}") {
        cur_user = nick;
        pass = password;
        console.log("Registado com sucesso");
        // ranking();
    }
    else {
        console.log("Erro nas credencias");
        cur_user = undefined;
        pass = undefined;
    }
}

//regista utilizador (também serve como login)
function register() {
    let user = getUsername();
    let pass = getPassword();

    let obj = {
        nick: user,
        password: pass
    };

    let body = JSON.stringify(obj);

    console.log(body);
    fetch(url + "register", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: body
    })
        .then(response => response.json())
        .then(json => SaveCredantials(json, user, pass))
        // .then(console.log)
        .catch(console.log);
}