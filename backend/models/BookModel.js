import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const BookModel = new Schema({
    title: { type: String },
    author: { type: String }
})
export default mongoose.model('books', BookModel)