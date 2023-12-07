// Trata de guardar scores 
const { error } = require('console');
const fs = require('fs');

module.exports.Score = class {

    Score(group, rows, columns) {
        this.group = group;
        this.rows = rows;
        this.columns = columns;
        this.rankData = {};
        this.filePath = 'rankData.txt';
    }

    //Atualiza o score dos jogadores envolvido num jogo 
    SaveScore(player1, player2, winner) {
        //todo 
    }

    // Adiciona um utilizador ao score (deve ser feito caso utilizador novo seja registado)
    AddUserToScore(name) {
        console.log("=> " + name);
    }

    //Retorna em formato de string a tabela de resultado para um jogo 
    GetScore() {
        //todo
    }

    // Método  para salvar dados num ficheiro txt
    saveToFile() {
        //todo
    }

    // Método que carrega dados do ficheiro
    loadFromFile(){
        fs.readFile('rankData.txt','utf8',(err,data) => {
            if (err){
                console.log("Erro ao ler dados do arquivo:", err);
                return null;
            }

            //objeto que guarda dados provenientes de .txt
            let rankDatabase = {};
            
            if (data){
                try{
                    rankDatabase = JSON.parse(data);
                }catch(parseError){
                    console.log("Erro ao analisar dados do ficheiro " + this.filePath + ":", parseError);
                    return null;
                }
            }

            // console.log("=>" + JSON.stringify(rankDatabase));
            console.log(rankDatabase["group_"+this.group]);
            console.log(rankDatabase["group_"+this.group][this.rows + "_por_" + this.columns]);

            this.ranking = rankDatabase["group_"+this.group][this.rows + "_por_" + this.columns];

        })
    }

};

/* (versão correta mas assincrona)
    loadFromFile(){
        fs.readFile('rankData.txt','utf8',(err,data) => {
            if (err){
                console.log("Erro ao ler dados do arquivo:", err);
                return null;
            }

            //objeto que guarda dados provenientes de .txt
            let rankDatabase = {};
            
            if (data){
                try{
                    rankDatabase = JSON.parse(data);
                }catch(parseError){
                    console.log("Erro ao analisar dados do ficheiro " + this.filePath + ":", parseError);
                    return null;
                }
            }

            // console.log("=>" + JSON.stringify(rankDatabase));
            console.log(rankDatabase["group_"+this.group]);
            console.log(rankDatabase["group_"+this.group][this.rows + "_por_" + this.columns]);

            this.ranking = rankDatabase["group_"+this.group][this.rows + "_por_" + this.columns];

        })
    }
 */