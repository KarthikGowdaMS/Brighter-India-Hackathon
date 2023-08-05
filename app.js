const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const https = require('https');
const { stringify } = require('querystring');
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
                "text": req.body.message
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



                // console.log("Success");

                const dataobj = JSON.parse(data);
                // console.log(response);
                const category = dataobj.result.prediction.intents[0].category;
                // console.log(category);
                if (category === 'FAKE') {
                    res.sendFile(__dirname + "/Failure.html");
                }

                else {
                    const tweet = new Tweet({
                        msg: req.body.message,
                        msgDate: date.getDate().toString()
                    });

                    await tweet.save();
                    res.sendFile(__dirname + "/Success.html");
                }


            }
            else {
                res.send('Server failure');

            }


        });

    });

    request.write(JSON.stringify(data));
    request.end();

});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});