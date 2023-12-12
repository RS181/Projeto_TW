//Guarda tabuleiros 

module.exports.Board = class {
    //dados auxiliares
    rows;
    columns;
    p1;
    p2;
    //Dados do objeto de resposta do update
    board;
    phase;
    step;
    turn;
    players = {};

    //Inicializa os objeto de players
    InitPlayers(player1,player2){
        // this.players = {player1:player1,player2:player2};
        this.players[player1] = "black";
        this.players[player2] = "white"; 
          
    }

    //Inicializa um novo tabuleiro 
    InitBoard(rows,columns){
        // console.log("--------------------")
        // console.log("DENTRO DO MÓDULO BoardGame");
        this.rows = rows;
        this.columns = columns;
        
        //Criamos o Objecto que corresponde ao tabuleiro inical

        let b = Array(rows).fill("empty").map(() => Array(columns).fill("empty"));
        
        this.board = b;
        // console.log("--------------------")
    }

    //Inicialização do objeto que representa o jogo 
    Init(rows,collumns,player1,player2){
        this.InitBoard(rows,collumns);
        this.InitPlayers(player1,player2);

        this.phase = "drop";
        this.step = "from";
        this.turn = player1;
    }

    //retorna o objecto de resposta (do update)
    ResponseObjectUpdate(){
        let res = 
            {
                "board" : this.board,
                "phase" : this.phase,
                "step" : this.step,
                "turn" : this.turn,
                "players" : this.players
            };

        return res;
    }

    //todo método que permite alterar um board recebido e 
    //todo e coloca esses dados nas variávies da classe
}