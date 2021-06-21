import express from 'express';
import bookRouter from './Routes/bookRouter.js'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';


const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes go here
app.use('/api/Books', bookRouter);
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

// mongodb connection
const uri = 'mongodb+srv://stravabot:gxy76UPB480YfX37@wxsdsmall.p9xng.mongodb.net/stravaDev?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB Connected!!")
}).catch(err => console.log(err))

