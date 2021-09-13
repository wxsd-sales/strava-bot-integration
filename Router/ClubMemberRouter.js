const ClubMemberDetails = require('../Models/ClubMemberDetails.js');
const express = require('express');
const ClubMemberRouter = express.Router();


ClubMemberRouter
    .get('/', (req,res) => {
        ClubMemberDetails.find({}).exec(function(err, docs) { 
            res.json(docs)
        }); 
    })
module.exports = ClubMemberRouter;