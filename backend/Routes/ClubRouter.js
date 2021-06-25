import express from 'express';
//import ClubDetails from '../models/ClubDetails';
const ClubRouter = express.Router();

ClubRouter
    .get('/', (req,res) => {
        res.json(docs) 
    })
export default ClubRouter;