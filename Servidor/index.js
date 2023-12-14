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
//todo se tiver tempo separar cada pedido em diferente módulos

//Entrega do trabalho dia 15 !!
//Teste dia 18 

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
    if (OnGoingGameSessions.length > 0) {
        console.log(OnGoingGameSessions[0]["group_99"]["players"]);
        // console.log();
        // console.log(OnGoingGameSessions[0]["responses"]);        
    }
    console.log("%%%%%%%%%%%%%%%%%%%%%%");
    console.log("--------------------");

    //Dividimos o que fazer com cada pedido consoante o /
    //todo adicionar metodo
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
            notify(request, response);
            break;
        case '/update':
            console.log("Entrei no /update");
            update(request, response);
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
                fs.writeFile('user.txt', JSON.stringify(UserDataObject, null, 2), 'utf8', (writeErr) => {
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
    console.log("TESTE 0");
    console.log(group);
    //Array de rankings
    let RankingArray = RankDataObject["group_" + group][size]["ranking"];

    console.log("TESTE 1");

    //objeto do rank de utilizador (caso exista)
    var UserRank = RankingArray.find(user => user.nick === nick);
    console.log("TESTE 2");


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
var OnGoingGameSessions = [];


//Função que adiciona ao objeto NotParedGamesObject uma nova sessão de jogo 
function AddNewGameSession(nick, rows, columns, group, hash) {
    // console.log("--------------------");
    // console.log("Dentro de AddNewGameSession")
    NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Pending"].push(hash);
    NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Creator"] = nick;

    // console.log("--------------------");
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

            if (typeof nick !== typeof "" || typeof password !== typeof "") {
                response.writeHead(400, headers.plain);
                response.end('{"error": "Invalid request data"}');
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


                let Board = new board.Board();
                //Inicializamos objeto que representa o jogo

                Board.Init(rows, columns, nick, respObj["game"]);
                let Game = {};
                Game["group_" + group] = Board.ResponseObjectUpdate();
                OnGoingGameSessions.push(Game);
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
                // NotParedGamesObject["group_" + group][rows + "_por_" + columns]["response"] = "";


                //Verificações se players tem rank, senão cria objeto de rank inicial para cada  
                GroupExists(group);
                CheckUserRankGroup(player1, rows, columns, group);
                CheckUserRankGroup(player2, rows, columns, group);

                //Adicionamos player2
                for (let session of OnGoingGameSessions) {
                    let group = Object.keys(session);
                    if (session[group[0]]["Hash"] == respObj["game"]) {
                        session[group[0]]["players"][nick] = "white";
                        console.log(session[group[0]]);
                        console.log(session[group[0]]["players"]);
                    }
                }

            }
            else {
                //mesmo utilizador que fez o join inicial 
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
                return { group: group, size: game };
            }
            // console.log(session);
        }
    }
    // console.log("--------------------");
    return false;
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
            // console.log(AuxObject);
            if (AuxObject != false) {
                console.log("Encontramos match no leave");
                let group = AuxObject["group"]; //grupo
                let size = AuxObject["size"];   //rows_por_cols

                // console.log(NotParedGamesObject[group][size]);

                NotParedGamesObject[group][size]["Pending"] = [];
                NotParedGamesObject[group][size]["Creator"] = "";
                // console.log(NotParedGamesObject[group][size]);
            }
            // 2º caso ) Abandonar  durante jogo 
            else {
                //apagar o objeto de jogo em que este elemento pertence

                let i = 0;
                //Percorremos todas as sessões de jogos a correr no momento
                for (let session of OnGoingGameSessions) {
                    let group = Object.keys(session);
                    //Se houver match das Hashes fazemos,removemos esse joga das sessões
                    if (session[group[0]]["Hash"] == game) {
                        // console.log("Encontramos match no indice " + i);
                        // console.log(session[group[0]]);

                        //Atualizamos score
                        let rows = session[group[0]]["board"].length;
                        let columns = session[group[0]]["board"][0].length;
                        let players = session[group[0]]["players"];
                        let nr_group = group[0].replace('group_', '');
                        let loser = nick;
                        let nicks = Object.keys(players);
                        let winner;
                        if (loser == nicks[0])
                            winner = nicks[1];
                        else
                            winner = nicks[0];

                        UpdateRankInformation(winner, rows, columns, nr_group, true);
                        UpdateRankInformation(loser, rows, columns, nr_group, false);

                        //Removemos a sessão do jogo
                        OnGoingGameSessions.splice(i, 1);
                        break;
                    }
                    i++;
                }
            }
            //todo ainda falta o caso de fazer leave automatico 


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

/* Inicio notify */

function CheckIfNegative(row, column) {
    if (row < 0)
        return [true, "row"];
    if (column < 0)
        return [true, "column"]
    return [false]
}

//Retorna caso exista o objecto que representa o jogo deste jogador
function SearchOnGoingSessions(nick, password, game) {
    // console.log("--------------------");
    // console.log("Dentro de SearchOnGoingSessions")
    const HashedPassword = crypto
        .createHash('md5')
        .update(password)
        .digest('hex');

    //Verifica se o par nick password dá match
    if (UserDataObject[nick] != HashedPassword) {
        // console.log("--------------------");
        return null;
    }

    //Retorna o indice (caso haja match) na lista de jogos que estão a decorrer
    let i = 0;
    for (let session of OnGoingGameSessions) {
        let group = Object.keys(session);
        //Se houver match da hash retornamos essa sessão
        if (session[group[0]]["Hash"] == game) {
            // console.log("--------------------");
            return i;
        }
        i++;

    }
    // console.log("--------------------");
    return null;
}

//Função que verifica se a jogada é valida (não quebra regras do jogo)
// 1) mais 3 peças contíguas da mesma cor 
// 2) moveu para mesmo sitio de onde veio após ronda anterior 
function CheckIfPlayIsValid(board, row, column, color) {
    console.log("--------------------");
    console.log("Dentro de CheckIfPlayIsValid");
    let count = 0;
    board[row][column] = color;
    console.log(board);

    //Verificação out of bounds 
    if (row >= board.length || column >= board[0].length)
        return false;

    //Verificação de linha
    for (let i = 0; i < board[row].length; i++) {
        if (board[row][i] == color) {
            count++;
            if (count > 3) {
                board[row][column] = 'empty';
                return false; // Mais de 3 peças contíguas encontradas na linha
            }
        } else {
            count = 0; // Reiniciar a contagem se a cor não coincidir
        }
    }

    count = 0;
    //Verificação de coluna
    for (let i = 0; i < board.length; i++) {
        if (board[i][column] == color) {
            count++;
            if (count > 3) {
                board[row][column] = 'empty';
                return false; // Mais de 3 peças contíguas encontradas na coluna
            }
        } else {
            count = 0; // Reiniciar a contagem se a cor não coincidir
        }
    }

    console.log("--------------------");

    return true;
}

//Função auxiliar que muda turno do jogador 
function ChangeTurn(Game) {
    console.log("--------------------");
    console.log("Dentro de ChangeTurn");
    let turn = Game["turn"];
    let p = Game["players"];
    let nicks = Object.keys(p)
    if (turn == nicks[0]) {
        Game["turn"] = nicks[1];
    }
    else {
        Game["turn"] = nicks[0];
    }
    console.log("--------------------");
}

//Função que trata dos pedidos em /notify
function notify(request, response) {
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
            const move = requestDataObj.move;
            const row = move["row"];
            const column = move["column"];

            //Verficação se o pedido está no formato correto

            if (nick === undefined || password === undefined || game === undefined ||
                move === undefined || row === undefined || column === undefined) {
                response.writeHead(400, headers.plain);
                response.end('{"error": "Missing paramters in request"}');
                console.log("=======Fim Pedido=======");
                return;
            }

            if (typeof row !== 'number' || typeof column !== 'number') {
                response.writeHead(400, headers.plain);
                response.end('{"error": "The paramters row and column must be an Integer"}');
                console.log("=======Fim Pedido=======");
                return;
            }

            if (typeof nick !== typeof "" || typeof password !== typeof "" || typeof game !== typeof "") {
                response.writeHead(400, headers.plain);
                response.end('{"error": "Invalid request data"}');
                console.log("=======Fim Pedido=======");
                return;
            }

            let aux = CheckIfNegative(row, column);
            if (aux[0] == true) {
                response.writeHead(400, headers.plain);
                response.end('{"error": "' + aux[1] + ' is negative"}');
                console.log("=======Fim Pedido=======");
                return;
            }



            //todo fazer resto das verificações
            let GameIndice = SearchOnGoingSessions(nick, password, game);
            if (GameIndice != null) {
                let group = Object.keys(OnGoingGameSessions[GameIndice]);
                let Game = OnGoingGameSessions[GameIndice][group[0]];
                let color = Game["players"][nick];
                let phase = Game["phase"];
                //Verificação do turn 
                if (nick != Game["turn"]) {
                    response.writeHead(400, headers.plain);
                    response.end('{"error": "Not your turn to play"}');
                    console.log("=======Fim Pedido=======");
                    return;
                }

                //Verificação de Out of Bounds
                if (row >= Game["board"].length || column >= Game["board"][0].length) {
                    response.writeHead(400, headers.plain);
                    response.end('{"error": "Invalid postion : Out of Bounds"}');
                    console.log("=======Fim Pedido=======");
                    return;
                }


                //Verificação se a celula é vazia 
                if (Game["board"][row][column] != "empty") {
                    response.writeHead(400, headers.plain);
                    response.end('{"error": "non empty cell"}');
                    console.log("=======Fim Pedido=======");
                    return;
                }



                //todo tem que ter verficações diferentes para fase move

                //TODO chamamos o update quando notify é valido
                //Verficação se movimento é valido (mais de 3 em linha da mesma cor)
                if (phase === 'drop') {
                    if (CheckIfPlayIsValid(Game["board"], row, column, color) == false) {
                        response.writeHead(400, headers.plain);
                        response.end('{"error": "Invalid position : can only have 3 contiguous pieces of same color"}');
                        console.log("=======Fim Pedido=======");
                        return;
                    }
                }
                else if (phase === 'move') {
                    //todo 
                }
            }
            else {
                response.writeHead(400, headers.plain);
                response.end('{"error": "Game Not Found"}');
                console.log("=======Fim Pedido=======");
                return;
            }

            //todo modificar objeto de jogo
            let group = Object.keys(OnGoingGameSessions[GameIndice]);
            let Game = OnGoingGameSessions[GameIndice][group[0]];
            ChangeTurn(Game);

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

/* Inicio de Update (pedir ajuda a professor) */


//Função que trata do update
function update(request, response) {
    console.log("--------------------");
    console.log("Dentro de Update");
    const preq = url.parse(request.url, true);
    const nick = preq.query.nick;
    const game = preq.query.game;

    response.writeHead(200, headers.sse);
    for (let session of OnGoingGameSessions) {
        let group = Object.keys(session);
        if (session[group[0]]["Hash"] == game) {
            console.log("Match");
            session[group[0]]["responses"][nick] = response;
            console.log("--------------------");
            return;
        }
    }
    console.log("--------------------");
    // response.write('data: ola \n\n');

    //caso não encontre jogo
    response.end('{ "error": "Invalid game reference"}');

    //todo usar o responce no ongoing para mandar o jogo modificado 
    //todo no notify 

    //! Usar o objeto responce ,guardado no OnGoingGameSessions, para fazer dispersão 
    //! do tabuleiro com response.write (e só fazmos responce.end no fim)

    // console.log("--------------------");

}