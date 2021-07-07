import express from 'express';
import ActivityDetails from '../models/ActivityDetails.js';
const ActivityRouter = express.Router();

ActivityRouter
    .get('/', (req,res) => {
        ActivityDetails.find({}).sort({distance: -1}).exec(function(err, docs) { 
            res.json(docs)
        });
    })
export default ActivityRouter;