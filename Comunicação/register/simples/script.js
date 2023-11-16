

console.log("olá");

const url = "http://twserver.alunos.dcc.fc.up.pt:8008/";

function getUsername(){
    let aux = document.querySelector('#username');
    return aux.value;
}
function getPassword(){
    let aux = document.querySelector('#password');
    return password.value;
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
       .then(console.log)
       .catch(console.log);
}