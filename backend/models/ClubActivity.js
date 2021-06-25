import mongoose from 'mongoose';

var clubActivitySchema = mongoose.Schema({
    name: String,
    firstname: String,
    lastname: String,
    distance: String,
    moving_time: Number,
    elapsed_time: String,
    total_elevation_gain: String,
    type: String
});

var ClubActivityDetails = mongoose.model('Club_Activity_Details', clubActivitySchema);
export default ClubActivityDetails;