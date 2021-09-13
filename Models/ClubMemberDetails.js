const mongoose = require ('mongoose');

var clubMemberSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    name: String,
    membership: String,
    admin: Boolean,
    owner: Boolean
});

var ClubMemberDetails = mongoose.model('club_member_data', clubMemberSchema);

module.exports = ClubMemberDetails;