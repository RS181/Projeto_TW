//O ficheiro principal, que carrega os restantes módulos,
//define a função de processamento de pedido e inicia a sua escuta

"use strict";

let PORT = 8008;
let host = "localhost"

//Modulos 
const http = require('http');
const url = require('url');
const fs = require('fs');
const rank = require('./rank.js');

//todo importar os modulos para restantes funções

//Entrega do trabalho dia 15 !!
//Teste dia 18 

//todo professor sugeriu no inicio , carregar objetos 
//todo no inicio que tem utilizadores e ranking


/*  Cabeçalhos  */
const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
    sse: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
};


//todo tentar aplicar isto https://www.knowledgehut.com/blog/web-development/node-http-server




/* Servidor */
const Server = http.createServer(function (request, response) {
    const parsedURL = url.parse(request.url, true);
    const pathname = parsedURL.pathname;
    const query = JSON.stringify(parsedURL.query);

    // response.writeHead(200, { 'Content-Type': 'text/plain' });
    // response.write("URL = " + JSON.stringify(parsedURL.query) + "\n");
    // response.write("Path = " + pathname + "\n");

    // Configuração do CORS para permitir qualquer origem
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Resposta para solicitações OPTIONS
    if (request.method === 'OPTIONS') {
        response.writeHead(200, headers.plain);
        response.end();
        return;
    }

    //todo fazer função que carrega objetos que contêm os dados
    //todo de utilizadores e ranking 
    
    console.log("=======Inicio Pedido=======");

    console.log("--------------------");
    console.log("Estado do objeto do inicio pedido");
    console.log(UserDataObject);
    console.log("--------------------");


    //Dividimos o que fazer com cada pedido consoante o /
    switch (pathname) {
        case '/register':
            console.log("Entrei no /register");
            register(request, response);
            break;
        case '/ranking':
            console.log("Entrei no /ranking");
            ranking(request, response);
            break;
        case '/join':
            console.log("Entrei no /join");
            break;
        case '/leave':
            console.log("Entrei no /leave");
            break;
        case '/notify':
            console.log("Entrei no /notify");
            break;
        case '/update':
            console.log("Entrei no /update");
            break;
        default:
            console.log("Pedido desconhecido");
            response.writeHead(404, headers.plain);
            response.end();
            console.log("=======Fim Pedido=======");
            break;

    }

    // response.end("fim");

});

//Pomos o Servidor Http à escuta mas antes disso , fazemos uma função 
//anónima para carregar dados relevantes 
Server.listen(PORT, () => {
    console.log("Server Just Started");

    //Inicializa objecto que guarda dados de utilizador 
    GetUserData();

    //todo fazer  objecto que guarda dados de ranking 
});


//Objecto que guarda , em memória , o user.txt
var UserDataObject = {};

//carrega dados de utilizadores (quando inicia servidor) 
function GetUserData() {
    console.log("Entrei aqui");
    if (fs.existsSync("user.txt")) {
        console.log("Ficheiro já user.txt existe");
        //carrega dados do ficheiro ...
        fs.readFile('user.txt', 'utf8', (err, data) => {
            if (err) {
                console.error("Erro ao ler dados do arquivo:", err);
                return;
            }
            if (data) {
                try {
                    UserDataObject = JSON.parse(data);
                    // console.log(UserDataObject);
                } catch (parseError) {
                    console.error("Erro ao analisar dados do ficheiro user.txt : ", parseError);
                    return;
                }
            }
        });

    }
    else {
        console.log("Ficheiro  user.txt não existe");
        //criar ficheiro ...
        //todo criar ficheiro  user.txt 
        fs.writeFile('user.txt','',function(err){
            if (err) throw err;
            console.log("Criado ficheiro user.txt");
        });
    }
}




//Função que trata dos pedidos em /register 
/* 
TODO Adicionar o seguinte no método abaixo
1) verificar se o ficheiro existe se não cria um ficheiro chamado user.txt (no primeiro registo)
*/
function register(request, response) {

    //obter dados do pedido (quando bloco de dados estiver disponivel)
    let requestData = '';
    request.on('data', chunk => {
        requestData += chunk.toString();
        console.log("--------------------");
        console.log("Request Data = " + requestData);
        console.log("--------------------");
    });

    //Quando a leitura terminar 
    request.on('end', () => {
        try {
            // Serialização dos dados no pedido
            const requestDataObj = JSON.parse(requestData);
            //todo
            //Modificar isto abaixo para ler e guardar dados através do objeto (usamos o objeto
            //para evitar ter que estar a fazer a leitura de ficheiros).Em termos do ficheiro devemos
            //ir guardando o proprio objeto stringificado lá   

            // Verificar se o utilizador já está registrado
            if (UserDataObject[requestDataObj.nick]) {
                // Verificar se a password está correta
                if (UserDataObject[requestDataObj.nick] === requestDataObj.password) {
                    // Sucesso: utilizador registado e password correta
                    response.writeHead(200, headers.plain);
                    response.end("{}");
                    console.log("=======Fim Pedido=======");
                } else {
                    // password diferente
                    response.writeHead(401, headers.plain);
                    response.end('{"error": "User registered with a different password"}');
                    console.log("=======Fim Pedido=======");
                }
            } else {
                // Utilizador não registrado(Adicionar)
                UserDataObject[requestDataObj.nick] = requestDataObj.password;
                console.log("--------------------");
                console.log("Estado objeto após adicionamento");
                console.log(UserDataObject);
                console.log("--------------------");
                // Escrever os dados atualizados no arquivo
                fs.writeFile('user.txt', JSON.stringify(UserDataObject), 'utf8', (writeErr) => {
                    if (writeErr) {
                        console.error("Erro ao escrever dados no arquivo:", writeErr);
                        response.writeHead(500, headers.plain);
                        response.end('{"error": "Internal Server Error"}');
                        return;
                    }

                    // Responder com sucesso
                    response.writeHead(200, headers.plain);
                    response.end("{}");
                    console.log("=======Fim Pedido=======");
                });
            }
        } catch (error) {
            // Erro ao analisar os dados do pedido
            response.writeHead(400, headers.plain);
            response.end('{"error": "Invalid request data"}');
        }
    });
}


//Função que trata dos pedidos em /ranking
/* 
TODO Adicionar o seguinte no método abaixo
1) verificar se o ficheiro existe se não cria (logo no inicio)
2) resolver aquele problema de esperar até receber objeto vindo do 
módulo rank.js
*/
function ranking(request, response) {
    //obter dados do pedido (quando bloco de dados estiver disponivel)
    let requestData = '';
    request.on('data', chunk => {
        requestData += chunk.toString();
        console.log("Request Data = " + requestData);
    });

    // Quando a leitura terminar
    request.on('end', () => {
        try {
            // Serialização dos dados no pedido
            const requestDataObj = JSON.parse(requestData);
            const group = requestDataObj.group;
            const size = requestDataObj.size;
            const rows = requestDataObj.size.rows;
            const columns = requestDataObj.size.columns;

            // Verificar se a propriedade 'group' está definida
            if (!group) {
                response.writeHead(200, headers.plain);
                response.end('{"error": "Undefined group"}');
                console.log("=======Fim Pedido=======");
                return;
            }

            // Verificar se a propriedade 'size' está definida e é um objeto
            if (!size || typeof size !== 'object') {
                response.writeHead(400, headers.plain);
                response.end('{"error": "Invalid size \'' + size + '\'" }');
                console.log("=======Fim Pedido=======");

                return;
            }

            // Verificar se a propriedade 'size.rows' está definida e é um inteiro
            if (!rows || typeof rows !== 'number' || !Number.isInteger(rows)) {
                response.writeHead(400, headers.plain);
                response.end('{"error": "size property rows with invalid value \'' + rows + '\'" }');
                console.log("=======Fim Pedido=======");
                return;
            }

            // Verificar se a propriedade 'size.columns' está definida e é um número
            if (!columns || typeof columns !== 'number' || !Number.isInteger(columns)) {
                response.writeHead(400, headers.plain);
                response.end('{"error": "size property columns with invalid value \'' + columns + '\'" }');
                console.log("=======Fim Pedido=======");
                return;
            }

            // Verificar se o 'group' é válido 
            if (typeof group !== 'number') {
                response.writeHead(400, headers.plain);
                response.end('{"error": "Invalid group \'' + group + '\'" }');
                console.log("=======Fim Pedido=======");
                return;
            }

            const tabela = new rank.Score();
            //chamamos o construtor
            tabela.Score(group, rows, columns);
            console.log("Group = " + tabela.group);
            console.log("Nr Linhas = " + tabela.rows);
            console.log("Nr Colunas = " + tabela.columns);

            //estou a ter problemas 
            //pelo facto de execução não esperar que acaba 
            //loadFromFile , indicar possiveis soluções que eu penso que funcionem 
            // como uso de promessas
            tabela.loadFromFile();
            console.log(tabela.ranking);


            // Se todos os dados são válidos, pode retornar a resposta do ranking (por enquanto, uma resposta padrão sem dados)
            response.writeHead(200, headers.plain);



            response.end('{ "ranking": [] }');
            console.log("=======Fim Pedido=======");

        } catch (error) {
            // Erro ao analisar os dados da solicitação
            response.writeHead(400, headers.plain);
            response.end('{"error": "Invalid request data"}');
            console.log("=======Fim Pedido=======");

        }
    });
}
