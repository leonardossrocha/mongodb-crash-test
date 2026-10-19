# 💥 MongoDB Crash Test: O Limite do `find()`

Este repositório contém uma demonstração prática projetada para aulas de Engenharia de Software e Banco de Dados NoSQL. 

O objetivo deste experimento é provar, na prática, **por que não devemos utilizar laços de repetição na camada de aplicação (backend) para realizar relatórios analíticos em larga escala**, introduzindo a necessidade arquitetural do **Aggregation Pipeline**.

## 🎯 O Problema (A Dor Arquitetural)
Desenvolvedores iniciantes costumam extrair dados do banco usando comandos simples como `db.collection.find()` e, em seguida, utilizam linguagens como JavaScript, Java ou Python (`for`, `reduce`, `map`) para calcular médias e agrupamentos.

Quando o banco de dados cresce para milhões de registros, essa abordagem causa:
1. **Lentidão extrema (Latência de Rede):** Trafegar milhões de documentos do banco para a aplicação.
2. **Estouro de Memória (Out of Memory):** A RAM do servidor backend não suporta alocar arrays gigantescos.
3. **Uso ineficiente de CPU:** A linguagem da aplicação gasta tempo processando o que o motor C++ do banco faria nativamente.

---

## 🚀 Como executar este experimento

### Pré-requisitos
* **Docker** instalado.
* **Node.js** (versão 16+ recomendada).

### Passo 1: Subir o MongoDB via Docker
Inicie um contêiner do MongoDB expondo a porta `27017` para a sua máquina local:
```bash
docker run --name mongo-lab -p 27017:27017 -d mongo:latest
```

### Passo 2: Gerar a Massa de Dados
Vamos inserir 5 milhões de registros para "estressar" a aplicação.
1. Acesse o shell do MongoDB dentro do Docker:
```bash
docker exec -it mongo-lab mongosh
```
2. Copie todo o conteúdo do arquivo `seed.js` deste repositório e cole no terminal do `mongosh`. Aguarde a conclusão da carga.

### Passo 3: Executar o "Crash Test" no Node.js
Abra um novo terminal (fora do Docker), instale as dependências e rode o script de teste:
```bash
npm install mongodb
node crash_test.js
```

**Observe o terminal:** O script medirá exatamente quantos milissegundos sua aplicação perdeu apenas para puxar os dados pela rede e tentar calcular a média na RAM. Dependendo da sua máquina, a aplicação pode travar com o erro `JavaScript heap out of memory`.

---

## 💡 A Solução: Aggregation Pipeline
Após sentir a "dor" do tempo de carregamento ou do travamento, a solução é delegar a matemática para a *engine* do banco de dados, fazendo com que o MongoDB processe tudo no disco/cache e devolva **apenas a resposta final**.

Abra o `mongosh` e execute:
```javascript
db.produtos_massivos.aggregate([
  {
    $group: {
      _id: null,
      ticket_medio: { $avg: "$preco" }
    }
  }
])
```
*Note como o resultado é devolvido em frações de segundo, sem tráfego inútil de rede!*

---
**Autor:** [Professor Leonardo Rocha](www.linkedin.com/in/leonardossrocha) 
**Disciplina:** Banco de Dados NoSQL / Engenharia de Software