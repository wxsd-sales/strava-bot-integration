const express = require('express');
const ClubActivityDetails = require('../Models/ClubActivityDetails.js');

const ClubActivityRouter = express.Router();

ClubActivityRouter
    .get('/', (req,res) => {
        ClubActivityDetails.find({}).sort({distance: -1}).exec(function(err, docs) { 
            res.json(docs)
        }); 
    })
module.exports = ClubActivityRouter;
