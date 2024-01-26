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
//todo quando tiver tempo separar cada pedido em diferente módulos

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
    const method = request.method;
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
    console.log('\n');
    console.log("=======Inicio Pedido=======");
    console.log(method);
    console.log("%%%%%%%%%%%%%%%%%%%%%%");
    console.log("Jogos a decorrer");
    console.log(OnGoingGameSessions);
    console.log("%%%%%%%%%%%%%%%%%%%%%%");
    console.log("--------------------");

    switch (method) {
        case 'POST':
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
                default:
                    console.log("Pedido desconhecido 1");
                    response.writeHead(404, headers.plain);
                    response.end();
                    console.log("=======Fim Pedido=======");
                    break;
            }
            break;
        case 'GET':
            switch (pathname) {
                case '/update':
                    console.log("Entrei no /update");
                    update(request, response);
                    break;
                default:
                    console.log("Pedido desconhecido 2");
                    response.writeHead(404, headers.plain);
                    response.end();
                    console.log("=======Fim Pedido=======");
                    break;
            }
            break;
        default:
            console.log("Pedido desconhecido 3");
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
}
//Verifica se utilizador já tem rank (se não tem cria) ✅
function CheckUserRankGroup(nick, row, column, group) {
    let size = row + "_por_" + column;
    //Array de rankings
    let RankingArray = RankDataObject["group_" + group][size]["ranking"];

    //objeto do rank de utilizador (caso exista)
    var UserRank = RankingArray.find(user => user.nick === nick);

    //Se não existir uma entrada no ranking associada a um utilizador cria 
    if (UserRank == undefined) {
        AddUserToRankGroup(nick, row, column, group);
        return;
    }
}

//Incrementa os dados de rank associados a um utilizador (supondo que já 
// temos o objeto de utilizador na lista "ranking") ✅
function UpdateRankInformation(nick, row, column, group, iswinner) {
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

    SaveRank.saveToFile(RankDataObject);
}

//Adiciona utilizador  a um certo rank ✅
function AddUserToRankGroup(nick, row, column, group) {
    let size = row + "_por_" + column;

    let UserInfo = {
        "nick": nick,
        "victories": 0,
        "games": 0
    };
    RankDataObject["group_" + group][size]["ranking"].push(UserInfo);

    //Guarda os dados , no objeto com os ranks , no ficheiro de texto 
    SaveRank.saveToFile(RankDataObject);
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

function GenerateGameHash(group, rows, columns) {
    let date = new Date();

    //Geramos uma nova hash apartir da string value
    let value = "" + group + rows + columns + date.getTime();
    const GameHash = crypto
        .createHash('md5')
        .update(value)
        .digest('hex');

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
    NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Pending"].push(hash);
    NotParedGamesObject["group_" + group][rows + "_por_" + columns]["Creator"] = nick;
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

                //Verificações se players tem rank, senão cria objeto de rank inicial para cada  
                GroupExists(group);
                CheckUserRankGroup(player1, rows, columns, group);
                CheckUserRankGroup(player2, rows, columns, group);

                //Adicionamos player2
                for (let session of OnGoingGameSessions) {
                    let group = Object.keys(session);
                    if (session[group[0]]["Hash"] == respObj["game"]) {
                        session[group[0]]["players"][nick] = "white";
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

//Função que verifica se  existe algum jogo com certo game definido no objeto NotParedGamesObject
function CheckGameHashExist(GameHash) {
    //Ciclo exterior percorremos grupos
    for (let group in NotParedGamesObject) {
        let sizes = NotParedGamesObject[group];
        //Ciclo interior percorremos diferentes tamanhos de jogo
        for (let game in sizes) {
            let session = NotParedGamesObject[group][game];
            if (session["Pending"] == GameHash) {
                return { group: group, size: game };
            }
        }
    }
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
            if (AuxObject != false) {
                console.log("Encontramos match no leave");
                let group = AuxObject["group"]; //grupo
                let size = AuxObject["size"];   //rows_por_cols

                NotParedGamesObject[group][size]["Pending"] = [];
                NotParedGamesObject[group][size]["Creator"] = "";

                //Elimina objeto de OnGoingGameSessions
                let i = 0;
                for (let session of OnGoingGameSessions) {
                    let group = Object.keys(session);
                    if (session[group[0]]["Hash"] == game) {
                        EndGameUpdate(null, session[group[0]]);
                        OnGoingGameSessions.splice(i, 1);
                        break;
                    }
                    i++;
                }
            }
            // 2º caso ) Abandonar  durante jogo 
            else {
                //Percorremos todas as sessões de jogos a correr no momento
                for (let session of OnGoingGameSessions) {
                    let group = Object.keys(session);
                    //Se houver match das Hashes fazemos,removemos esse joga das sessões
                    if (session[group[0]]["Hash"] == game) {
                        let players = session[group[0]]["players"];
                        let loser = nick;
                        let nicks = Object.keys(players);
                        let winner;
                        if (loser == nicks[0])
                            winner = nicks[1];
                        else
                            winner = nicks[0];

                        EndGameUpdate(winner, session[group[0]]);
                        break;
                    }
                }
            }

            //Não fiz leave automático

            response.writeHead(200, headers.plain);
            response.end("{}");
            console.log("=======Fim Pedido=======");
        } catch (error) {
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
    const HashedPassword = crypto
        .createHash('md5')
        .update(password)
        .digest('hex');

    //Verifica se o par nick password dá match
    if (UserDataObject[nick] != HashedPassword) {
        return null;
    }

    //Retorna o indice (caso haja match) na lista de jogos que estão a decorrer
    let i = 0;
    for (let session of OnGoingGameSessions) {
        let group = Object.keys(session);
        if (session[group[0]]["Hash"] == game) {
            return i;
        }
        i++;

    }
    return null;
}

//Função que verifica se a jogada é valida (não quebra regras do jogo)
// 1) mais 3 peças contíguas da mesma cor 
// 2)(Não fiz esta parte) moveu para mesmo sitio de onde veio após ronda anterior 
function CheckIfPlayIsValid(board, row, column, color) {
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
    return true;
}

//Função auxiliar que muda turno do jogador 
function ChangeTurn(Game) {
    let turn = Game["turn"];
    let p = Game["players"];
    let nicks = Object.keys(p)
    if (turn == nicks[0]) {
        Game["turn"] = nicks[1];
    }
    else {
        Game["turn"] = nicks[0];
    }
}

//devolve o objeto de resposta do update
function ObjectOfUpdate(Game) {
    let obj = {
        board: Game["board"],
        phase: Game["phase"],
        step: Game["step"],
        turn: Game["turn"],
        players: Game["players"]
    }
    return obj;
}

//Função auxiliar que difunde para jogadores no jogo o tabuleiro
function UpdatePlayers(Game) {
    let nicks = Object.keys(Game["responses"]);
    let responce1 = Game["responses"][nicks[0]];
    let responce2 = Game["responses"][nicks[1]];
    let ans = JSON.stringify(ObjectOfUpdate(Game));

    responce1.write('data: ' + ans + '\n\n');
    responce2.write('data: ' + ans + '\n\n');

}

//Função auxiliar que envia o objeto {"winner" : (...)} para 
//todas as responses do update presentes no objeto que representa o jogo
function EndGameUpdate(winner, Game) {
    let res = Object.keys(Game["responses"]);
    // console.log(res)
    for (let user of res) {
        let obj = { winner: winner };
        //fechamos o response do update 
        Game["responses"][user].write('data: ' + JSON.stringify(obj) + '\n\n');
    }

    //Atualizar rank e apagar objeto do jogo
    if (winner != null) {
        let i = 0;
        //Percorremos todas as sessões de jogos a correr no momento
        for (let session of OnGoingGameSessions) {
            let group = Object.keys(session);
            //Se houver match das Hashes fazemos,removemos esse joga das sessões
            if (session[group[0]]["Hash"] == Game["Hash"]) {
                let rows = session[group[0]]["board"].length;
                let columns = session[group[0]]["board"][0].length;
                let players = session[group[0]]["players"];
                let nr_group = group[0].replace('group_', '');
                let nicks = Object.keys(players);
                let loser = "";
                if (winner == nicks[0])
                    loser = nicks[1];
                else
                    loser = nicks[0];

                UpdateRankInformation(winner, rows, columns, nr_group, true);
                UpdateRankInformation(loser, rows, columns, nr_group, false);

                //Removemos a sessão do jogo
                OnGoingGameSessions.splice(i, 1);
                break;
            }
            i++;
        }
    }
}

//Verifica se estamos em condições de mudar phase 
//se sim modifica objeto 
function ChangePhase(Game) {
    let board = Game["board"];
    let n = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] != 'empty') {
                n++;
            }
        }
    }
    //Já colocamos todas as peças 
    if (n == 24) {
        Game["phase"] = "move";
    }
}

//Verfica se linha ou coluna tem 3 peças contíguas (atualiza objeto do jogo)
function CheckAuxArrays(Game, color) {
    let count = 0;
    let board = Game["board"];
    //Verificação na linha
    for (let i = 0; i < board.length; i++) {
        let cond = false;
        count = 0;
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] == color) {
                count++;
                if (count === 3) {
                    //pronto para remover
                    if (Game[color + "row"][i] == false && Game["step"] == 'to')
                        return true;
                    Game[color + "row"][i] = true;
                    count = 0;
                    cond = true;
                }
            }
            else
                count = 0;
        }
        //Houve um movimento que quebrou linha de 3 peças contiguas
        if (Game[color + "row"][i] == true && cond == false) {
            Game[color + "row"][i] = false;
        }
    }

    //Verificação de coluna
    for (let j = 0; j < board[0].length; j++) {
        count = 0;
        let cond = false;
        for (let i = 0; i < board.length; i++) {
            if (board[i][j] == color) {
                count++;
                if (count === 3) {
                    //pronto para remover
                    if (Game[color + "col"][j] == false && Game["step"] == 'to')
                        return true;
                    Game[color + "col"][j] = true;
                    count = 0;
                    cond = true;
                }
            }
            else
                count = 0;
        }
        //Houve um movimento que quebrou coluna de 3 peças contiguas
        if (Game[color + "col"][j] == true && cond == false) {
            Game[color + "row"][j] = false;
        }
    }

}

//Inicializa array no objeto do jogo , para auxiliar 
//o parte de take na fase move
function InitializeAuxArrays(Game) {
    if (Game["blackrow"] == undefined) {
        let board = Game["board"];
        console.log(board);
        let rows = board.length;
        let cols = board[0].length;
        Game["blackrow"] = Array(rows).fill(false);
        Game["blackcol"] = Array(cols).fill(false);
        Game["whiterow"] = Array(rows).fill(false);
        Game["whitecol"] = Array(cols).fill(false);

        CheckAuxArrays(Game, "black");
        CheckAuxArrays(Game, "white");
    }
}

//Verifica se a peça escoldida pertence ao jogador que vai jogar
function CheckPlayerPiece(Game, row, col) {
    let turn = Game["turn"];
    let pcolor = Game["players"][turn];
    let pselected = Game["board"][row][col];

    if (pcolor == pselected) {
        return true;
    }
    else {
        return false;
    }

}

//Verifica se o movimento feito é valido
function CheckMoveIsValid(Game, dest_row, dest_col) {
    let or_row = Game["selected"]["row"];
    let or_col = Game["selected"]["col"];

    //Diferença absoluta entre as coordenadas
    let rowDiff = Math.abs(dest_row - or_row);
    let colDiff = Math.abs(dest_col - or_col);

    // Verifica se a diferença é igual a 1 em ambas as direções (linha e coluna)
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        return true;
    } else {
        console.log("Movimento inválido!");
        return false;
    }
}

//Verifica se estamos em condições de fim de jogo
function CheckIfGameIsOver(Game) {
    let board = Game["board"];
    let rows = board.length;
    let cols = board[0].length;
    let pretas = 0;
    let brancas = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] == 'black')
                pretas++;
            else if (board[i][j] == 'white')
                brancas++;
        }
    }

    //condição de fim de jogo
    if (pretas < 3 || brancas < 3) {
        console.log("FIM DO JOGO ATINGIDO");
        let nicks = Object.keys(Game["players"]);
        let p1 = nicks[0];  //p1 associado sempre a peça preta
        let p2 = nicks[1];  //p2 associado sempre a peça branca

        if (pretas > brancas) {
            EndGameUpdate(p1, Game);
        }
        else if (brancas > pretas) {
            EndGameUpdate(p2, Game);
        }
    }

    //todo falta verificar se o jogador que vai jogar tem movimentos válidos
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

            //todo falta verificar se jogador não vai mover-se para ultimo posicionamento

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

                //Verficação se movimento é valido 
                if (phase === 'drop') {
                    //Verificação se a celula é vazia 
                    if (Game["board"][row][column] != "empty") {
                        response.writeHead(400, headers.plain);
                        response.end('{"error": "non empty cell"}');
                        console.log("=======Fim Pedido=======");
                        return;
                    }
                    //Não tem mais de 3 peças em linha da mesma cor
                    if (!CheckIfPlayIsValid(Game["board"], row, column, color)) {
                        response.writeHead(400, headers.plain);
                        response.end('{"error": "Invalid position : can only have 3 contiguous pieces of same color"}');
                        console.log("=======Fim Pedido=======");
                        return;
                    }
                    ChangeTurn(Game);

                }
                else if (phase === 'move') {
                    //função só altera informação no objeto do jogo na transição de drop para move
                    InitializeAuxArrays(Game);

                    if (Game["step"] == 'from') {
                        //verifica se a peça esolchida pertence ao jogador que vai jogar
                        if (!CheckPlayerPiece(Game, row, column)) {
                            response.writeHead(400, headers.plain);
                            response.end('{"error": "Invalid move: not your piece"}');
                            console.log('{"error": "Invalid move: not your piece"}');
                            console.log("=======Fim Pedido=======");
                            return;
                        }
                        Game["step"] = 'to';
                        //Adicionar algo ao objeto de jogo a indicar peça ecolhida
                        Game["selected"] = { row: row, col: column };
                    }
                    else if (Game["step"] == 'to') {
                        let source = Game["selected"];

                        //des-selecionar (escolheu a mesma peça)
                        if (source["row"] == row && source["col"] == column) {
                            Game["step"] = 'from';
                            response.writeHead(200, headers.plain);
                            response.end("{}");
                            console.log("DES-SELECIONAR");
                            UpdatePlayers(Game);
                            console.log("=======Fim Pedido=======");
                            return;
                        }


                        //Verificação se a celula é vazia 
                        if (Game["board"][row][column] != "empty") {
                            response.writeHead(400, headers.plain);
                            response.end('{"error": "non empty cell"}');
                            console.log('{"error": "non empty cell"}');
                            console.log("=======Fim Pedido=======");
                            return;
                        }
                        //Verifica se movimento é de uma só casa na vert. e hor.
                        if (!CheckMoveIsValid(Game, row, column)) {
                            response.writeHead(400, headers.plain);
                            response.end('{ "error": "Invalid move: can only move to neigbouring cells, vertical or horizontally" }');
                            console.log('{ "error": "Invalid move: can only move to neigbouring cells, vertical or horizontally" }');
                            console.log("=======Fim Pedido=======");
                            return;
                        }

                        //Verifica se movimento não quebra regra das 3 pecas contiguas
                        Game["board"][source["row"]][source["col"]] = 'empty';
                        if (!CheckIfPlayIsValid(Game["board"], row, column, color)) {
                            response.writeHead(400, headers.plain);
                            response.end('{"error": "Invalid position : can only have 3 contiguous pieces of same color"}');
                            console.log('{"error": "Invalid position : can only have 3 contiguous pieces of same color"}');
                            Game["board"][source["row"]][source["col"]] = color;
                            console.log("=======Fim Pedido=======");
                            return;
                        }
                        let AbleToRemove = CheckAuxArrays(Game, color);

                        //Existe condições para remover
                        if (AbleToRemove === true) {
                            Game["step"] = 'take';
                        }
                        else {
                            Game["step"] = 'from';
                            ChangeTurn(Game);
                        }
                    }
                    else if (Game["step"] == 'take') {
                        console.log("TODO");
                        //verifica se estamos a remover peça do oponente
                        if (Game["board"][row][column] == color) {
                            response.writeHead(400, headers.plain);
                            response.end('{"Invalid move": "select a piece of diferent color"}');
                            console.log('{"Invalid move": "select a piece of diferent color"}');
                            console.log("=======Fim Pedido=======");
                            return;
                        }
                        if (Game["board"][row][column] == 'empty') {
                            response.writeHead(400, headers.plain);
                            response.end('{"Invalid move": "selected empty cell "}');
                            console.log('{"Invalid move": "selected empty cell "}');
                            console.log("=======Fim Pedido=======");
                            return;
                        }

                        //Já fizemos as verificações e estamos prontos para remover
                        Game["board"][row][column] = 'empty';

                        //fazer o CheckAuxArrays para cor removida
                        if (color == 'black')
                            CheckAuxArrays(Game, 'white');
                        else if (color == 'white')
                            CheckAuxArrays(Game, 'black');


                        Game["step"] = 'from';
                        ChangeTurn(Game);
                    }
                    //Verifica se é fim de jogo
                    CheckIfGameIsOver(Game);
                    console.log("Movimento válido!");
                }
            }
            else {
                response.writeHead(400, headers.plain);
                response.end('{"error": "Game Not Found"}');
                console.log("=======Fim Pedido=======");
                return;
            }

            let group = Object.keys(OnGoingGameSessions[GameIndice]);
            let Game = OnGoingGameSessions[GameIndice][group[0]];

            //Só fazemos isto em baixo se o pedido notify for valido 
            ChangePhase(Game);
            UpdatePlayers(Game);

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
    const preq = url.parse(request.url, true);
    const nick = preq.query.nick;
    const game = preq.query.game;

    response.writeHead(200, headers.sse);
    for (let session of OnGoingGameSessions) {
        let group = Object.keys(session);
        if (session[group[0]]["Hash"] == game) {
            console.log("Match");
            session[group[0]]["responses"][nick] = response;
            //Quando temos a response de update para os dois jogadores
            if (Object.keys(session[group[0]]["responses"]).length == 2) {
                UpdatePlayers(session[group[0]]);
            }
            console.log("=======Fim Pedido=======");
            return;
        }
    }
    //caso não encontre jogo
    response.end('{ "error": "Invalid game reference"}');

}