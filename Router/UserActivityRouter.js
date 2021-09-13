const UserActivityData = require('../Models/UserActivityData.js');
const express = require('express');


const UserActivityRouter = express.Router();

UserActivityRouter
    .get('/', (req,res) => {
        UserActivityData.find({}).exec(function(err, docs) { 
            res.json(docs)
        });
    })

module.exports = UserActivityRouter;

//.sort({start_date_local: 1})