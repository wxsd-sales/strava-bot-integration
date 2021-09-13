const express = require('express');
const WebhookActivityData = require('../Models/WebhookActivityData.js');
const WebhookActivityDataRouter = express.Router();

WebhookActivityDataRouter
    .get('/', (req,res) => {
        WebhookActivityData.find({}).exec(function(err, docs) { 
            res.json(docs)
        });
    })
    // .post('/webhook', (req, res) => {

        
    // })
module.exports = WebhookActivityDataRouter;