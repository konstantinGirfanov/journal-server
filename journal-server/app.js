'use strict';
const express = require('express');
const { Client } = require("pg");

const app = express();
app.set('port', process.env.PORT || 3000);

function executeQuery(query, res) {
    const connection = new Client({
        host: "localhost",
        user: "postgres",
        port: 5432,
        password: "",
        database: "new_database"
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

app.post('/authorization', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    let query = `select * from users where nickname='${email}' and password='${password}'`;
    executeQuery(query, res);

    //executeQuery(`select * from users where nickname='leha' and password='test'`, res);
});

app.post('/attendance-done', (req, res) => {
    const attendanceId = req.body.attendanceId;
    const students = req.body.students;

    let query = '';
    for (let i = 0; i < students.length; i++) {
        query += `insert into attendance_student
        (id_condition_students, id_attendance, id_student) 
        values ('${students[i].condition}', '${attendanceId}', '${students[i].id}');`;
    }
    
    executeQuery(query, res);
});

app.post('/time-table', (req, res) => {
    const groupId = req.body.groupId;

    // типа список пар
    let query = `
    select distinct c.week_day, c.lesson_start_time, c.lesson_end_time, c.classroom, d.lesson, t2."name", t2.lastname
    from "class" c 
	    join timetable t on c.id_timetable = t.id
	    join "groups" g on g.id_timetable = t.id 
	    join disciplines d on d.id_class = c.id 
	    join teacher_discipline td on td.id_disciplines = d.id
	    join teachers t2 on t2.id = td.teacher_id
    where g.id = ${groupId}`;

    executeQuery(query, res);
});

app.post('/teachers', (req, res) => {
    const groupId = req.body.groupId;

    // типа список преподов
    let query = `
    select distinct t2."name", t2.lastname, t2.patronymic, d.lesson
    from "class" c
	    join timetable t on c.id_timetable = t.id
	    join "groups" g on g.id_timetable = t.id
	    join disciplines d on d.id_class = c.id
	    join teacher_discipline td on td.id_disciplines = d.id
	    join teachers t2 on t2.id = td.teacher_id
    where g.id = ${groupId}`;

    executeQuery(query, res);
});





app.get('/users', (req, res) => {
    executeQuery('select * from users;', res);
});

app.get('/dudes', (req, res) => { res.send('dudes') });

const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});