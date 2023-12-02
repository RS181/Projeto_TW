//O ficheiro principal, que carrega os restantes módulos,
//define a função de processamento de pedido e inicia a sua escuta

"use strict";

let PORT = 8008;

//Modulos 
const http = require('http');
const url = require('url');
const fs = require('fs');

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


    //Dividimos o que fazer com cada pedido consoante o /
    console.log("=======Inicio Pedido=======")
    switch (pathname) {
        case '/register':
            console.log("Entrei no /register");

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
                    fs.readFile('dados.txt', 'utf8', (err, data) => {
                        if (err) {
                            console.error("Erro ao ler dados do arquivo:", err);
                            response.writeHead(500, headers.plain); 
                            response.end('{"error": "Internal Server Error"}');
                            return;
                        }

                        let userDatabase = {};

                        //Tentamos colocar os dados em dados.txt (no objeto userDatabase)
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
                            } else {
                                // password diferente
                                response.writeHead(200, headers.plain);
                                response.end('{"error": "User registered with a different password"}');
                            }
                        } else {
                            // Utilizador não registrado(Adicionar)
                            userDatabase[requestDataObj.nick] = requestDataObj.password;

                            // Escrever os dados atualizados no arquivo
                            fs.writeFile('dados.txt', JSON.stringify(userDatabase), 'utf8', (writeErr) => {
                                if (writeErr) {
                                    console.error("Erro ao escrever dados no arquivo:", writeErr);
                                    response.writeHead(500, headers.plain); 
                                    response.end('{"error": "Internal Server Error"}');
                                    return;
                                }

                                // Responder com sucesso
                                response.writeHead(200, headers.plain);
                                response.end("{}");
                            });
                        }
                    });
                } catch (error) {
                    // Erro ao analisar os dados do
                    response.writeHead(400, headers.plain); 
                    response.end('{"error": "Invalid request data"}');
                }
            });

            break;
        case '/ranking':
            console.log("Entrei no /ranking");
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
    }

    // response.end("fim");

}).listen(PORT);


