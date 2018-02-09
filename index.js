//Inclusão de bibliotecas
const express = require('express');
const app = express();
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

//Configurações
app.set('view engine', 'ejs');
app.use(expressMongoDb('mongodb://localhost/decoradoria'));
app.use(bodyParser.json());


// Rotas Clientes

// Postar novos clientes
app.get('/clientes', (req, res) => {
    req.db.collection('clientes').find({}).toArray((err, dados) => {
        res.render('cadastro', {posts:dados});
    });
});

// Pegar clientes e mostrar em formato HTML
app.get('/apiclientes', (req, res) => {
    req.db.collection('clientes').find({}).toArray((err, dados) => {
        res.send(dados);
    });
});

// Pegar clientes e mostrar em formato JSON
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
    req.db.collection('itens').insert(req.body, (err, dados) => {
        res.send(dados);
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

//Listen
app.listen(3001, () => {
    console.log('Servidor escutando na porta 3001');
});