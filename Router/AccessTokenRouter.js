const express = require ('express');
const AccessToken = require('../Models/AccessToken.js');
const AccessTokenRouter = express.Router();

AccessTokenRouter
    .get('/', (req,res) => {
        AccessToken.find({}).exec(function(err, docs) { 
            res.json(docs)
        });
    })
    .post('/', (req, res) => {
        try {
            const body = req.body;
            // var obj = new AccessToken();
            // obj.athlete_id = body.athlete_id;
            // obj.expires_in = body.expires_in;
            // obj.expires_at = body.expires_at;
            // obj.access_token = body.access_token;
            // obj.refresh_token = body.refresh_token;
            // obj.token_type = body.token_type;

            // const user = 
                AccessToken.findOneAndUpdate({athlete_id: body.athlete_id}, { 
                expires_in: body.expires_in,
                expires_at: body.expires_at,
                access_token: body.access_token,
                refresh_token: body.refresh_token,
                token_type: body.token_type}, {new: true, upsert: true}, function(err, res){
                    console.log("User token saved in the db")
                });
            //   if(!user){
            //     obj.save();
            //   }
            //obj.save();
            
            res.json({result: true})

        } catch(err){
            res.json({result: false})
        }
        
    });

module.exports = AccessTokenRouter;