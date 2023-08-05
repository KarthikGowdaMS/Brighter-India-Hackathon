const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const http = require('http');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const date = new Date();
// const day = date.getDate();

mongoose.connect('mongodb://0.0.0.0:27017/fruitsDB', {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
    msg: String,
    msgDate: String
});

const Tweet = mongoose.model('Tweet', postSchema);


app.get('/', async function(req, res){
    res.sendFile(__dirname + "./index.html");
});

app.post('/', async function(req, res){
    const tweet = new tweet({
        msg: req.body.message,  
        msgDate: date.getDate().toString()
    });

    await tweet.save();
});