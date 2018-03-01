//Inclusão de bibliotecas
const express = require('express');
const app = express();
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');

//Configurações
app.set('view engine', 'ejs');
app.use(expressMongoDb('mongodb://decoradoria:decoradoria@ds127993.mlab.com:27993/decoradoria'));
app.use(bodyParser.json());
app.use(cors());

// Rotas Clientes

// Listar clientes
app.get('/clientes', (req, res) => {
    req.db.collection('clientes').find({}).toArray((err, dados) => {
        res.render('cadastro', {posts:dados});
    });
});

// Pegar clientes e mostrar em formato JSON
app.get('/apiclientes', (req, res) => {
    req.db.collection('clientes').find({}).toArray((err, dados) => {
        res.send(dados);
    });
});

// Postar novo cliente
app.post('/apiclientes', (req, res) => {
    req.db.collection('clientes').insert(req.body, (err, dados) => {
        res.send(dados);
    });
});

// Pegar clientes por ID
app.get('/apiclientes/:id', (req, res) => {
    req.db.collection('clientes').findOne({_id: new ObjectID(req.params.id)}, (err, dados) => {
        res.send(dados);
    });
});


// Deletar clientes por ID
app.delete('/apiclientes/:id', (req, res) => {
    req.db.collection('clientes').remove({_id: new ObjectID(req.params.id)}, (err, dados) => {
        res.send(dados);
    });
});

// Rotas itens

// Postar novos itens 
app.post('/apiitens', (req, res) => {
    let busca = {
        // idCliente: req.body.idCliente,
        clienteId: req.body.clienteId,
        ambiente: req.body.ambiente,
        tipo: req.body.tipo
    };

    req.db.collection('itens').findOne(busca, (err, dadosDoBanco) => {
        if(dadosDoBanco){
            let novaOpcao = req.body.opcoes[0];
            dadosDoBanco.opcoes.push(novaOpcao);

            req.db.collection('itens').update(busca, dadosDoBanco, (err, dadosAtualizados) => {
                res.send(dadosAtualizados);
            });
        }else{
            req.db.collection('itens').insert(req.body, (err, dadosInseridos) => {
                res.send(dadosInseridos);
            });
        }
    });

    
});

// Pegar itens e mostrar em formato HTML
app.get('/itens', (req, res) => {
    req.db.collection('itens').find({}).toArray((err, dados) => {
        res.render('itens', {posts:dados});
    });
});

// Pegar itens e mostrar em formato JSON (padrão API)
app.get('/apiitens', (req, res) => {
    req.db.collection('itens').find({}).toArray((err, dados) => {
        res.send(dados);
    });
});

// Pegar itens por ID
app.get('/apiitens/:id', (req, res) => {
    req.db.collection('itens').findOne({_id: new ObjectID(req.params.id)}, (err, dados) => {
        res.send(dados);
    });
});


// Deletar itens por ID
app.delete('/apiitens/:id', (req, res) => {
    req.db.collection('itens').remove({_id: new ObjectID(req.params.id)}, (err, dados) => {
        res.send(dados);
    });
});

// Update status aprovado

app.post('/updateitem', (req, res) => {
    let busca = {
        clienteId: req.body.clienteId,
        ambiente: req.body.ambiente,
        tipo: req.body.tipo,
        modelo: req.body.modelo,
        status: req.body.status
    };

    console.log(busca);

    req.db.collection("itens").update(
        {"clienteId": busca.clienteId,"opcoes.modelo": busca.modelo},
        {$set: {"opcoes.$.status":"aprovado"} },
        false,
        true
    );

    req.db.collection("itens").update(
        {"clienteId": busca.clienteId,"opcoes.modelo": busca.modelo, "opcoes.status":"analise"},
        {$set: {"opcoes.$.status":"naoAprovado"} },
        false,
        true
    );

    res.send(busca);

    
});

// Procurar itens aprovados

app.post('/itensaprovados', (req, res) => {
    let busca = {
        clienteId: req.body.clienteId
    };

    req.db.collection('itens').find(
    {"clienteId": busca.clienteId},{"opcoes": {$elemMatch: {"status": 'aprovado'} }}
    ).toArray((err, itensAprovados) => {
        res.send(itensAprovados);
    });
});

// Procurar itens para compra

app.get('/itenscompras', (req, res) => {
    req.db.collection('itens').find({"opcoes": {$elemMatch: {"status": 'analise'} }}
    ).toArray((err, itensCompras) => {
        res.send(itensCompras);
    });
});


// Postar novos projetos

app.post('/apiprojetos', (req, res) => {
    let busca = {
        clienteId: req.body.clienteId,
        ambiente: req.body.ambiente,
        tipo: req.body.tipo
    };

    req.db.collection('projetos').findOne(busca, (err, dadosDoBanco) => {
        if(dadosDoBanco){
            let novaOpcao = req.body.opcoes[0];
            dadosDoBanco.opcoes.push(novaOpcao);

            req.db.collection('projetos').update(busca, dadosDoBanco, (err, dadosAtualizados) => {
                res.send(dadosAtualizados);
            });
        }else{
            req.db.collection('projetos').insert(req.body, (err, dadosInseridos) => {
                res.send(dadosInseridos);
            });
        }
    });

    
});


// Pegar projetos

app.get('/apiprojetos', (req, res) => {
    req.db.collection('projetos').find({}).toArray((err, dados) => {
        res.send(dados);
    });
});


// Procurar itens para editar

app.post('/itenseditados', (req, res) => {
    let busca = {
        ambiente: req.body.ambiente,
        tipo:req.body.tipo,
        clienteId: req.body.clienteId
    };

    req.db.collection('itens').find(
    {"clienteId": busca.clienteId},{"tipo": busca.tipo},{"ambiente": busca.ambiente},  
    ).toArray((err, itensEditados) => {
        res.send(itensEditados);
    });
});

//Listen
app.listen(3001, () => {
    console.log('Servidor escutando na porta 3001');
});