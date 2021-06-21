import express from 'express';
import BookModel from '../models/BookModel.js';
const bookRouter = express.Router();
bookRouter
    .get('/', (req,res) => {
        res.json([
            {
                id: 1,
                title: "Alice's Adventures in Wonderland",
                author: "Charles Lutwidge Dodgson"
            },
            {
                id: 2,
                title: "Einstein's Dreams",
                author: "Alan Lightman"
            }
        ])
    })
    .get('/2', (req,res) => {
        res.json({
            id: 2,
            title: "Einstein's Dreams",
            author: "Alan Lightman"
        })   
    })
    .post('/', (req, res) => {
        let book = new BookModel(req.body);
        book.save();
        res.status(201).send(book) 
    })
export default bookRouter;