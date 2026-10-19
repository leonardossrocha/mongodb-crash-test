/* Nome do banco criado no Docker desktop (conferir nome da base)
use techstore_db;

Para testar esse código, será necessário ter instalado no computador o mongodb. Para isso execute:
$ npm install mongodb

Depois, execute o código abaixo com:
$ node crash_test.js
*/

const { MongoClient } = require('mongodb');

// Limite drástico de memória para forçar o erro mais rápido
const v8 = require('v8');
v8.setFlagsFromString('--max-old-space-size=50'); // Limita a RAM do Node a ~50MB

async function runCrashTest() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Conectado ao banco de dados...");
        const database = client.db('techstore_db');
        const produtos = database.collection('produtos_massivos');

        console.log("Iniciando extração via .find()...");
        // Adição de marcador de tempo
        // console.time("TempoTotalDoFind"); // Inicia o cronômetro
        // Puxando todos os documentos para a memória!
        const todosProdutos = await produtos.find({}).toArray(); 
        // console.timeEnd("TempoTotalDoFind"); // Para e mostra os segundos gastos

        console.log(`Carregados ${todosProdutos.length} produtos na RAM.`);
        console.log("Calculando ticket médio em JavaScript...");
        
        /* Adição de marcador de tempo
        Essa linha deve ser inserida para realizar testes de crash ou tempo para execução. Se não der crash, vai mostrar o tempo necessário para a execução do script
        */
        // console.time("TempoDoCalculoJS"); // Inicia cronômetro da matemática
        let somaTotal = 0;
        for (let i = 0; i < todosProdutos.length; i++) {
            somaTotal += todosProdutos[i].preco;
        }

        const media = somaTotal / todosProdutos.length;
        // console.timeEnd("TempoDoCalculoJS"); // Para e mostra os segundos
        console.log(`Ticket Médio calculado: R$ ${media.toFixed(2)}`);

    } catch (e) {
        console.error("\n[FALHA CATASTRÓFICA DE SISTEMA] Ocorreu um erro:");
        console.error(e.message);
    } finally {
        await client.close();
    }
}

runCrashTest();

