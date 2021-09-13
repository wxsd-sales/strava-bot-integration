const express = require('express');
const AuthenticatedAthleteDetails = require('../Models/AuthenticatedAthleteDetails.js');
const AthenticatedAthleteRouter = express.Router();

AthenticatedAthleteRouter
    .get('/', (req,res) => {
        AuthenticatedAthleteDetails.find({}).exec(function(err, docs) { 
            res.json(docs)
        });
    })
module.exports = AthenticatedAthleteRouter;