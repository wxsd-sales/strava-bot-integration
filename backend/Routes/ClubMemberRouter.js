import express from 'express';
//import ClubMemberDetails from '../models/ClubMemberDetails';
const ClubMemberRouter = express.Router();

ClubMemberRouter
    .get('/', (req,res) => {
        console.log("*****************CLUB MEMBER ROUTER " + docs);
        res.json(docs) 
    })
export default ClubMemberRouter;