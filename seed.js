/*
Código usado para criar registros no mongodb, rodando no docker desktop
Comando para criar o container mongodb no docker:
$ docker run --name mongo-lab -p 27017:27017 -d mongo:latest

Comando para executar esse container para acesso via CMD
$ docker exec -it mongo-lab mongosh

Em seguida, no mongosh, cole o código abaixo e execute. Altere o valor no laço for i < 200000 para aumentar o número de registros gerados na base
*/


db.produtos_massivos.drop();

print("Gerando massa de dados. Por favor, aguarde...");
let bulk = db.produtos_massivos.initializeUnorderedBulkOp();
// O valor do laço deve ser alterado para testar capacidade de memória do computador em uso.
// Deverá dar crash ou rodará, mas levará um tempo. Ambas as informações podem ser utilizadas para elucidar aos alunos o tempo de acesso aos documentos no mongodb. Imaginar cenário com muitos acessos ao mesmo tempo.
const totalRegistros = 5000000; // 5 milhões (Ajuste se necessário)
for (let i = 0; i < totalRegistros; i++) {
    bulk.insert({
        nome: "Produto " + i,
        categoria: (i % 2 === 0) ? "Eletrônicos" : "Móveis",
        preco: Math.random() * 1000,
        estoque: Math.floor(Math.random() * 100),
        ativo: true
    });
    
    // Executa o lote a cada 10.000 registros para não estourar a memória de inserção
    if (i % 10000 === 0) {
        bulk.execute();
        bulk = db.produtos_massivos.initializeUnorderedBulkOp();
        print(`Inseridos ${i} registros...`);
    }
}

// Executa o lote final
bulk.execute();
print(`Carga de ${totalRegistros} registros concluída com sucesso!`);