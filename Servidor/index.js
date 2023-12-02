//O ficheiro principal, que carrega os restantes módulos,
//define a função de processamento de pedido e inicia a sua escuta

"use strict";

let PORT = 8008;

//Modulos 
const http = require('http');
const url = require('url');
const fs = require('fs');
const rank = require('./rank.js');

//todo importar os modulos para restantes funções




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


/* Servidor */
http.createServer(function (request, response) {
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

    //Dividimos o que fazer com cada pedido consoante o /
    console.log("=======Inicio Pedido=======")
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

}).listen(PORT);


//Função que trata dos pedidos em /register
function register(request, response) {

    //obter dados do pedido (quando bloco de dados estiver disponivel)
    let requestData = '';
    request.on('data', chunk => {
        requestData += chunk.toString();
        console.log("Request Data = " + requestData);
    });

    //Quando a leitura terminar 
    request.on('end', () => {
        try {
            // Serialização dos dados no pedido
            const requestDataObj = JSON.parse(requestData);

            // Ler os dados do arquivo
            fs.readFile('user.txt', 'utf8', (err, data) => {
                if (err) {
                    console.error("Erro ao ler dados do arquivo:", err);
                    response.writeHead(500, headers.plain);
                    response.end('{"error": "Internal Server Error"}');
                    return;
                }

                let userDatabase = {};

                //Tentamos colocar os dados em user.txt (no objeto userDatabase)
                if (data) {
                    try {
                        userDatabase = JSON.parse(data);
                    } catch (parseError) {
                        console.error("Erro ao analisar dados do arquivo JSON:", parseError);
                        response.writeHead(500, headers.plain);
                        response.end('{"error": "Internal Server Error"}');
                        return;
                    }
                }

                // Verificar se o utilizador já está registrado
                if (userDatabase[requestDataObj.nick]) {
                    // Verificar se a password está correta
                    if (userDatabase[requestDataObj.nick] === requestDataObj.password) {
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
                    userDatabase[requestDataObj.nick] = requestDataObj.password;

                    // Escrever os dados atualizados no arquivo
                    fs.writeFile('user.txt', JSON.stringify(userDatabase), 'utf8', (writeErr) => {
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
            });
        } catch (error) {
            // Erro ao analisar os dados do pedido
            response.writeHead(400, headers.plain);
            response.end('{"error": "Invalid request data"}');
        }
    });
}


//Função que trata dos pedidos em /ranking
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

            // Verificar se a propriedade 'group' está definida
            if (!requestDataObj.group) {
                response.writeHead(200, headers.plain);
                response.end('{"error": "Undefined group"}');
                console.log("=======Fim Pedido=======");
                return;
            }

            // Verificar se a propriedade 'size' está definida e é um objeto
            if (!requestDataObj.size || typeof requestDataObj.size !== 'object') {
                response.writeHead(400, headers.plain);
                response.end('{"error": "Invalid size \'' + requestDataObj.size + '\'" }');
                console.log("=======Fim Pedido=======");

                return;
            }

            // Verificar se a propriedade 'size.rows' está definida e é um número
            if (!requestDataObj.size.rows || typeof requestDataObj.size.rows !== 'number' || !Number.isInteger(requestDataObj.size.rows)) {
                response.writeHead(400, headers.plain);
                response.end('{"error": "size property rows with invalid value \'' + requestDataObj.size.rows + '\'" }');
                console.log("=======Fim Pedido=======");
                return;
            }

            // Verificar se a propriedade 'size.columns' está definida e é um número
            if (!requestDataObj.size.columns || typeof requestDataObj.size.columns !== 'number' || !Number.isInteger(requestDataObj.size.columns)) {
                response.writeHead(400, headers.plain);
                response.end('{"error": "size property columns with invalid value \'' + requestDataObj.size.columns + '\'" }');
                console.log("=======Fim Pedido=======");
                return;
            }

            // Verificar se o 'group' é válido 
            if (typeof requestDataObj.group !== 'number') {
                response.writeHead(200, headers.plain);
                response.end('{"error": "Invalid group \'' + requestDataObj.group + '\'" }');
                console.log("=======Fim Pedido=======");
                return;
            }

            // Se todos os dados são válidos, pode retornar a resposta do ranking (por enquanto, uma resposta padrão sem dados)
            response.writeHead(200, headers.plain);
            //todo Utilizador o modulo rank.js e criar uma função que vai buscar o ranking
            //todo do grupo e retorna-o (ver como é que vamos guardar ranking com professor
            //todo ,num ficheiro texto?)
            response.end('{ "ranking": [] }');
            console.log("=======Fim Pedido=======");

        } catch (error) {
            // Erro ao analisar os dados da solicitação
            response.writeHead(400, headers.plain);
            response.end('{"error": "Invalid request data"}');
        }
    });
}
