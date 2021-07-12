var mongoose = require('mongoose');

var clubMemberSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    name: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    membership: String,
    admin: Boolean,
    owner: Boolean
});

var ClubMemberDetails = mongoose.model('Club_Member_Details', clubMemberSchema);

module.exports = ClubMemberDetails;
//export default ClubMemberDetails;