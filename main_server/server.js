const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectID } = require("mongodb");
const path = require('path');

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const urlMongodb = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(urlMongodb, { useUnifiedTopology: true, useNewUrlParser: true });
let _client;

// Подключение к базе данных и сервера к нужному порту
mongoClient.connect(function(err, client) {
    if(err) {
        return console.log(err);
    }
    _client = client;
    app.table = client.db("_users_db").collection("users");
    app.listen(3000);
});

app.get("/register", urlencodedParser, function (request, response) {
    response.sendFile(path.join(__dirname, "register.html"));
});

app.post("/register", urlencodedParser, function (request, response) {
    if(!request.body) {
        return response.sendStatus(400);
    }
    console.log(request.body);
    app.table.insertOne(
        {userName: request.body.userName, userAge: request.body.userAge},
        {},
        function (err, record) {
            if (err) {
                console.log(err);
                response.sendStatus(400);
            } else {
                response.redirect(`/user/${record.insertedId}`);
            }
        });
});

app.get("/user/:id", urlencodedParser, function (request, response) {
    const _id = request.params.id;

    app.table.find({_id: new ObjectID(_id)}).toArray(function (err, results) {
        if (err || results.length !== 1) {
            response.sendStatus(400);
        } else {
            response.send(`<body>${results[0].userName} - ${results[0].userAge}</body>`)
        }
    })
});

app.get("/", function(request, response){
    response.set({ 'Set-Cookie': 'login=yes'});
    response.redirect('/register');
});
