import express from 'express';
import ClubMemberDetails from '../models/ClubMemberDetails.js';
const ClubMemberRouter = express.Router();

ClubMemberRouter
    .get('/', (req,res) => {
        ClubMemberDetails.find({}).exec(function(err, docs) { 
            res.json(docs)
        }); 
    })
export default ClubMemberRouter;