import mongoose from 'mongoose';

var clubSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        index: true,
        required: true
      },
    name: String,
    sport_type: String,
    member_count: Number,
    country: String,
    city: String,
    state: String,
    verified: Boolean
});

var ClubDetails = mongoose.model('Club_Details', clubSchema);
export default ClubDetails;