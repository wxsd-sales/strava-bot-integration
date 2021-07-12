var mongoose = require('mongoose');

var clubActivitySchema = mongoose.Schema({
    name: String,
    firstname: String,
    lastname: String,
    distance: Number,
    moving_time: Number,
    elapsed_time: Number,
    total_elevation_gain: Number,
    type: String
});

var ClubActivityDetails = mongoose.model('Club_Activity_Details', clubActivitySchema);
//export default ClubActivityDetails;
module.exports = ClubActivityDetails;