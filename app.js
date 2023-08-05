const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const https = require('https');
// const { connect } = require('http2');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const date = new Date();
const port = 3000 || process.env.PORT;
// const day = date.getDate();

mongoose.connect('mongodb+srv://karthikgowdams27:123@tweets.vqnbjuv.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });

const postSchema = new mongoose.Schema({
    msg: String,
    msgDate: String
});

const Tweet = mongoose.model('Tweet', postSchema);


app.get('/', async function (req, res) {
    res.sendFile(__dirname + "/intro.html");
});

app.post('/', async function (req, res) {

    const data = {
        "kind": "Conversation",
        "analysisInput": {
            "conversationItem": {
                "id": "1",
                "participantId": "1",
                "text": "hi"
            }
        },
        "parameters": {
            "projectName": "test1",
            "deploymentName": "test-nlp",
            "stringIndexType": "TextElement_V8"
        }
    }

    // let dataobj;

    const headers = {
        "Ocp-Apim-Subscription-Key": '2c1c43a0282f482898b92dc3772a0366'
    };
    const options = {
        method: "POST",
        headers: headers
    };
    const request = https.request('https://nlp-test.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2022-10-01-preview', options, (response) => {

        response.on('data', async (data) => {


            if (response.statusCode >= 200 && response.statusCode <= 300) {

                const tweet = new Tweet({
                    msg: req.body.message,
                    msgDate: date.getDate().toString()
                });

                await tweet.save();
                // res.send('success');
                // console.log("Success");
                // alert("Success");
                const dataobj = JSON.parse(data);
                // console.log(response);
                res.write(dataobj.result.prediction.intents);
                res.redirect('/');
            }
            else {
                res.send('failure');
                console.log("Failure");
                // alert("Failure");
            }


        });

    });

    request.write(JSON.stringify(data));
    request.end();

});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});