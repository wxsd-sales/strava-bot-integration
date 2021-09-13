const ClubDetails = require('../Models/ClubDetails.js')
const express = require('express');
const ClubDetailsRouter = express.Router();
ClubDetailsRouter
    .get('/', (req,res) => {
        ClubDetails.find({}).exec(function(err, docs) { 
            console.log("Hello world")
            res.json(docs)
        });
    })
module.exports = ClubDetailsRouter;