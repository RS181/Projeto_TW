//O ficheiro principal, que carrega os restantes módulos,
//define a função de processamento de pedido e inicia a sua escuta

"use strict";

let PORT = 8008;
let host = "localhost"

//Modulos 
const http = require('http');
const url = require('url');
const fs = require('fs');
const crypto = require('crypto');
const rank = require('./rank.js');
const board = require('./BoardGame.js');
//todo importar os modulos para restantes funções

//Entrega do trabalho dia 15 !!
//Teste dia 18 

//todo professor sugeriu no inicio , carregar objetos 
//todo no inicio que tem utilizadores e ranking


/*  Cabeçalhos  */
const headers = {
    plain: {
        'Content-Type': 'application/json',
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
const Server = http.createServer(function (request, response) {
    const parsedURL = url.parse(request.url, true);
    const pathname = parsedURL.pathname;
    const query = JSON.stringify(parsedURL.query);

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
    console.log("=======Inicio Pedido=======");
    console.log("--------------------");
    console.log("Estado dos objeto no inicio pedido");
    console.log(UserDataObject);
    console.log();
    console.log(RankDataObject);
    console.log();
    console.log(NotParedGamesObject);

    console.log("%%%%%%%%%%%%%%%%%%%%%%");
    console.log("Jogos a decorrer");
    console.log(OnGoingGameSessions);   
    console.log("%%%%%%%%%%%%%%%%%%%%%%");
    console.log("--------------------");



    //Dividimos o que fazer com cada pedido consoante o /
    switch (pathname) {
        case '/register':
            console.log("Entrei no /register");
            register(request, response);    //✅
            break;
        case '/ranking':
            console.log("Entrei no /ranking");
            ranking(request, response);     // TODO confirmar resposta que envia
            break;
        case '/join':
            console.log("Entrei no /join");
            // manter estrutura de dados lista de jogos pendentes
            join(request, response);
            break;
        case '/leave':
            console.log("Entrei no /leave");
            leave(request, response);
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
});

//Pomos o Servidor Http à escuta mas antes disso , fazemos uma função 
//anónima para carregar dados relevantes 
Server.listen(PORT, () => {
    console.log("Server Just Started");

    //Inicializa objecto que guarda dados de utilizador 
    GetUserData();

    //Inicializa objecto que guarda dados de ranking
    GetRankData();
});

/* Inicio da inicialização dos objetos que vão guardar dados de utilizadores e rank  */

//Objecto que guarda , em memória , os dados em user.txt
var UserDataObject = {};

//carrega dados de utilizadores (quando inicia servidor) 
function GetUserData() {
    //Verificamos se ficheiro existe
    if (fs.existsSync("user.txt")) {
        console.log("Ficheiro user.txt já existe");
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
        fs.writeFile('user.txt', '', function (err) {
            if (err) throw err;
            console.log("Criado ficheiro user.txt");
        });
    }
}


//Objecto que guarda , em memória , os dados em rankData.txt
var RankDataObject = {};
function GetRankData() {
    //Verificamos se ficheiro existe
    if (fs.existsSync("rankData.txt")) {
        console.log("Ficheiro rankData.txt já existe");
        //carregar dados do ficheiro
        fs.readFile('rankData.txt', 'utf8', (err, data) => {
            if (err) {
                console.error("Erro ao ler dados do arquivo:", err);
                return;
            }
            if (data) {
                try {
                    RankDataObject = JSON.parse(data);
                    // console.log(UserDataObject);
                } catch (parseError) {
                    console.error("Erro ao analisar dados do ficheiro user.txt : ", parseError);
                    return;
                }
            }
        });
    }
    else {
        console.log("Ficheiro  rankData.txt não existe");
        //criar ficheiro 
        fs.writeFile('rankData.txt', '', function (err) {
            if (err) throw err;
            console.log("Criado ficheiro rankData.txt");
        });

    }
}



/* Inicio do /register */

//Função que trata dos pedidos em /register 
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

            //Encriptação da palavra passe
            const HashedPassword = crypto
                .createHash('md5')
                .update(requestDataObj.password)
                .digest('hex');

            // Verificar se o utilizador já está registrado
            if (UserDataObject[requestDataObj.nick]) {
                // Verificar se a password está correta
                if (UserDataObject[requestDataObj.nick] === HashedPassword) {
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
                UserDataObject[requestDataObj.nick] = HashedPassword;
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



/* Inicio do /ranking */


//SaveRank permite utilizar o modulo rank.js
const SaveRank = new rank.Score();


//Verifica se um grupo existe no objeto rankData.txt ✅
function GroupExists(group) {
    console.log("--------------------");
    console.log("Dentro de GroupExists");
    if (RankDataObject["group_" + group] != undefined) {
        console.log("grupo [" + group + "] já existe")
    } else {
        console.log("grupo [" + group + "] não existe")
        //criar os dados para um novo grupo em formato de objeto 
        RankDataObject["group_" + group] = {
            "6_por_6": {
                "ranking": []
            },
            "6_por_5": {
                "ranking": []
            },
            "5_por_6": {
                "ranking": []
            },
            "5_por_5": {
                "ranking": []
            }
        };
        //Guarda os dados , no objeto com os ranks , no ficheiro de texto 
        SaveRank.saveToFile(RankDataObject);

    }
    console.log(RankDataObject);
    console.log("--------------------");

}

//Verifica se utilizador já tem rank (se não tem cria) ✅
function CheckUserRankGroup(nick, row, column, group) {
    let size = row + "_por_" + column;
    //Array de rankings
    let RankingArray = RankDataObject["group_" + group][size]["ranking"];
    
    //objeto do rank de utilizador (caso exista)
    var UserRank = RankingArray.find(user => user.nick === nick);
    
    //Se não existir uma entrada no ranking associada a um utilizador
    //cria 
    if (UserRank == undefined) {
        AddUserToRankGroup(nick, row, column, group);
        return;
    }
}

//Incrementa os dados de rank associados a um utilizador (supondo que já 
// temos o objeto de utilizador na lista "ranking") ✅
function UpdateRankInformation(nick, row, column, group, iswinner) {
    console.log("--------------------");
    console.log("Dentro de UpdateRankInformation para : " + nick);

    let size = row + "_por_" + column;
    //Array de rankings
    let RankingArray = RankDataObject["group_" + group][size]["ranking"];


    //objeto do rank de utilizador (caso exista)
    var UserRank = RankingArray.find(user => user.nick === nick);

    UserRank.games += 1;

    //Se for vencedor aumenta número de vitorias
    if (iswinner === true) {
        UserRank.victories += 1;
    }

    // console.log(RankDataObject);


    SaveRank.saveToFile(RankDataObject);
    console.log("--------------------");
}

//Adiciona utilizador  a um certo rank ✅
function AddUserToRankGroup(nick, row, column, group) {
    // console.log("--------------------");
    // console.log("Dentro de AddUserToRankGroup");

    let size = row + "_por_" + column;

    let UserInfo = {
        "nick": nick,
        "victories": 0,
        "games": 0
    };

    RankDataObject["group_" + group][size]["ranking"].push(UserInfo);

    console.log(RankDataObject);

    //Guarda os dados , no objeto com os ranks , no ficheiro de texto 
    SaveRank.saveToFile(RankDataObject);

    // console.log("--------------------");
}



//Função que trata dos pedidos em /ranking
function ranking(request, response) {
    //obter dados do pedido (quando bloco de dados estiver disponivel)
    let requestData = '';
    request.on('data', chunk => {
        requestData += chunk.toString();
        console.log("--------------------");
        console.log("Request Data = " + requestData);
        console.log("--------------------");
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

            //Verifica se grupo existe no objeto (senão cria)
            GroupExists(group);

            // Se todos os dados são válidos, pode retornar a resposta do ranking (por enquanto, uma resposta padrão sem dados)
            response.writeHead(200, headers.plain);

            response.end(JSON.stringify(RankDataObject["group_" + group][rows + "_por_" + columns]));
            console.log("=======Fim Pedido=======");

        } catch (error) {
            // Erro ao analisar os dados da solicitação
            response.writeHead(400, headers.plain);
            response.end('{"error": "Invalid request data"}');
            console.log("=======Fim Pedido=======");

        }
    });
}

/* Inicio do /join */


// dados para criar hash -> group,rows,collumns 
//e tempo (arranjar forma de este tempo gerar nova hash
//a cada 15 min)
function GenerateGameHash(group, rows, columns) {
    // console.log("--------------------");
    // console.log("Entrei no GenerateGameHash");
    let date = new Date();

    //Geramos uma nova hash apartir da string value
    let value = "" + group + rows + columns + date.getTime();
    const GameHash = crypto
        .createHash('md5')
        .update(value)
        .digest('hex');

    // console.log(GameHash);
    // console.log("--------------------");
    return GameHash;

}

//Objeto que guarda jogos por emparelhar 
var NotParedGamesObject = {};

//Função que cria de raiz 
function Initialize(group) {
    //Creator indica quem foi o nick que inicio a procura por jogo
    NotParedGamesObject["group_" + group] =
    {
        "6_por_6": {
            Pending: [],
            Creator: ""
        },
        "6_por_5": {
            Pending: [],
            Creator: ""
        },
        "5_por_6": {
            Pending: [],
            Creator: ""
        },
        "5_por_5": {
            Pending: [],
            Creator: ""
        }
    };
}


//Contêm lista de objetos que representam jogos
var OnGoingGameSessions =[];


//Função que adiciona ao objeto NotParedGamesObject uma nova sessão de jogo 
function AddNewGameSession(nick, rows, columns, group, hash) {
    console.log("--------------------");
    console.log("Dentro de AddNewGameSession")
    NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Pending"].push(hash);
    NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Creator"] = nick;

    console.log(NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Pending"]);
    console.log(NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Creator"]);

    console.log("--------------------");
}


//Função que trata dos pedidos em /join
function join(request, response) {
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
            const group = requestDataObj.group;
            const nick = requestDataObj.nick;
            const password = requestDataObj.password;
            const size = requestDataObj.size;
            const rows = requestDataObj.size.rows;
            const columns = requestDataObj.size.columns;

            //Verificação se o pedido está no formato correto 

            if (group === undefined || size === undefined || rows === undefined
                || columns === undefined || nick === undefined || password === undefined) {
                response.writeHead(400, headers.plain);
                response.end('{"error": "Missing paramters in request"}');
                console.log("=======Fim Pedido=======");
                return;
            }

            if (typeof rows !== 'number' || typeof columns !== 'number' || typeof group !== 'number'
                || !Number.isInteger(rows) || !Number.isInteger(columns) || !Number.isInteger(group)) {
                response.writeHead(400, headers.plain);
                response.end('{"error": "The paramters group, rows and columns must be an Integer"}');
                console.log("=======Fim Pedido=======");
                return;
            }


            //Inicializa o objeto NotParedGamesObject caso necessário
            if (NotParedGamesObject["group_" + group] == undefined) {
                Initialize(group);
            }

            //Cria Hash caso não existe um jogo pendente 

            let respObj = {}

            if (NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Pending"].length == 0) {
                let Hash = GenerateGameHash(group, rows, columns);
                AddNewGameSession(nick, rows, columns, group, Hash);

                respObj["game"] = NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Pending"][0];
            }
            //Remove a Hash do Objeto NotParedGamesObject ,caso o nick
            //do pedido seja diferente daquele que crio a sessão(porque já houve emparelhamento)
            else if (NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Creator"] !== nick) {
                respObj["game"] = NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Pending"][0];

                let player1 = NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Creator"];
                let player2 = nick;

                console.log("EMPARELHAMENTO DE JOGADORES");
                NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Pending"] = [];
                NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Creator"] = "";

                //Verificações se players tem rank, senão cria objeto de rank inicial para cada  
                GroupExists(group);
                CheckUserRankGroup(player1,rows,columns,group);
                CheckUserRankGroup(player2,rows,columns,group);

                let Board = new board.Board();

                Board.Init(rows,columns,player1,player2);

                let Game ={}
                Game["group_"+group] =  Board.ResponseObjectUpdate();

                //adicionar ao arrya de sessões de jogo 
                OnGoingGameSessions.push(Game);
                // console.log(Board.ResponseObjectUpdate());  
                

            }
            else {
                respObj["game"] = NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Pending"][0];
            }
            
            response.writeHead(200, headers.plain);
            response.end(JSON.stringify(respObj));
            console.log("=======Fim Pedido=======");

        } catch (error) {
            //Erro ao analisar os dados do pedido
            response.writeHead(400, headers.plain);
            response.end('{"error": "Invalid request data"}');
        }

    })

}


/* Inicio leave */

//Função que verifica se  existe algum jogo com certo game definido no objeto 
//NotParedGamesObject
function CheckGameHashExist(GameHash) {
    // console.log("--------------------");
    // console.log("Dentro de CheckGameHashExist");

    //Ciclo exterior percorremos grupos
    for (let group in NotParedGamesObject) {
        let sizes = NotParedGamesObject[group];
        //Ciclo interior percorremos diferentes tamanhos de jogo
        for (let game in sizes) {
            let session = NotParedGamesObject[group][game];
            if (session["Pending"] == GameHash) {
                return { group: group, size: game};
            }
            // console.log(session);
        }
    }
    // console.log("--------------------");
    return {};
}

//Função que trata dos pedidos em /leave
function leave(request, response) {
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
            const nick = requestDataObj.nick;
            const password = requestDataObj.password;
            const game = requestDataObj.game;

            //Verificação se o pedido está no formato correto
            if (nick === undefined || password === undefined || game === undefined) {
                response.writeHead(400, headers.plain);
                response.end('{"error": "Missing paramters in request"}');
                console.log("=======Fim Pedido=======");
                return;
            }
            if (typeof (nick) !== typeof ("") || typeof (password) !== typeof ("") || typeof (game) !== typeof ("")) {
                response.writeHead(400, headers.plain);
                response.end('{"error": "Invalid request data"}');
                console.log("=======Fim Pedido=======");
                return;
            }

            // 1º caso ) Abandonar antes de emparelhamento

            //contem objeto {} ou {game:group,size:game} (grupo e hash associada ao jogo)
            let AuxObject = CheckGameHashExist(game);
            console.log(AuxObject);
            if (AuxObject != {}){
                console.log("Encontramos match no leave");
                let group = AuxObject["group"]; //grupo
                let size = AuxObject["size"];   //rows_por_cols

                // console.log(NotParedGamesObject[group][size]);

                NotParedGamesObject[group][size]["Pending"] = [];
                NotParedGamesObject[group][size]["Creator"] = "";

                // console.log(NotParedGamesObject[group][size]);
            }

            // todo fazer restantes casos 

            response.writeHead(200, headers.plain);
            response.end("{}");
            console.log("=======Fim Pedido=======");
        } catch (error) {
            //Erro ao analisar os dados do pedido
            response.writeHead(400, headers.plain);
            response.end('{"error": "Invalid request data"}');
        }

    })

}