const mongoose = require('mongoose');

var authenticatedAthleteSchema = mongoose.Schema({
    athlete_id: {
        type: Number,
        unique: true,
        index: true,
        required: true
      },
    username: String,
    firstname: String,
    lastname: String,
    fullname: String,
    nickname: String,
    city: String,
    state: String,
    country: String,
    clubs: Array
});

var AuthenticatedAthleteDetails = mongoose.model('authorized_athlete_model', authenticatedAthleteSchema);
module.exports = AuthenticatedAthleteDetails;