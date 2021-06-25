import mongoose from 'mongoose';

var clubActivitySchema = mongoose.Schema({
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

var ClubActivityDetails = mongoose.model('Club_Activity', clubActivitySchema);
export default ClubActivityDetails;