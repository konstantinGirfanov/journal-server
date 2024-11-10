'use strict';
var express = require('express');
const { Client } = require("pg");

var app = express();
app.set('port', process.env.PORT || 3000);

function executeQuery(query, res) {
    const connection = new Client({
        host: "localhost",
        user: "postgres",
        port: 5432,
        password: "",
        database: "testJournal"
    });

    connection.connect(err => {
        if (err) {
            console.error('[ERROR]Ошибка подключения к базе данных:', err);
            res.status(404).send('[ERROR]Ошибка подключения к базе данных:' + err);
            return;
        }
        console.log('[INFO] Подключение к базе данных установлено.');
    });
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            res.status(404).send('Ошибка 404');
            return;
        }
        res.json(results.rows);
    });
}

app.get('/', (req, res) => {
    res.send("Hello!");
});

app.get('/users', (req, res) => {
    executeQuery('select * from users;', res);
});

app.get('/dudes', (req, res) => { res.send('dudes') });

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});