// Trata de guardar scores 
const fs = require('fs');

module.exports.Score = class {


    // Método  para salvar dados no rankData.txt ficheiro txt
    //Passar o objeto e ele guarda o objeto stringificado no ficheiro de texto
    saveToFile(object) {
        // Escrever os dados atualizados no arquivo
        fs.writeFile('rankData.txt', JSON.stringify(object,null,2), 'utf8', (writeErr) => {
            if (writeErr) {
                // console.error("Erro ao escrever dados no arquivo:", writeErr);
                console.log("(FALHA) a guardar dados em rankData.txt");
                return;
            }
            console.log("(SUCESSO) a guardar dados em rankData.txt");
            
        });
    }
};

