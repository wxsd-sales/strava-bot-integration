import express from 'express';
import ClubDetails from '../models/ClubDetails.js';
const ClubRouter = express.Router();

ClubRouter
    .get('/', (req,res) => {
        ClubDetails.find({}).exec(function(err, docs) { 
            console.log("Hello world")
            res.json(docs)
        });
    })
export default ClubRouter;