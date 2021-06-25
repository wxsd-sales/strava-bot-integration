import express from 'express';
import ClubActivity from '../models/ClubActivity.js';
import ClubMemberDetails from '../models/ClubMemberDetails.js';
const ClubActivityRouter = express.Router();

ClubActivityRouter
    .get('/', (req,res) => {
        ClubMemberDetails.find({}).exec(function(err, docs) { 
            docs.map((info, index) => {
                ClubActivity.find({}).exec(function(err1, docs1) { 
                    var count = 0;
                    for(var item in docs1){
                        count += item["distance"]
                        console.log(count)
                    }
                    res.json(docs1)
                });
            });
        });
    })

export default ClubActivityRouter;