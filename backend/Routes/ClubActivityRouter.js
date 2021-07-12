import express from 'express';
import ClubActivity from '../models/ClubActivity.js';
//import ClubMemberDetails from '../models/ClubMemberDetails.js';
const ClubActivityRouter = express.Router();

ClubActivityRouter
    .get('/', (req,res) => {
        ClubActivity.find({}).sort({distance: -1}).exec(function(err, docs) { 
            res.json(docs)
        }); 
    })
export default ClubActivityRouter;

