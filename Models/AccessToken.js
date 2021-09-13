const mongoose = require ('mongoose');

var accessTokenSchema = mongoose.Schema({
    athlete_id: {
        type: Number,
        // unique: true,
        // index: true,
        required: true
      },
    access_token: String,
    expires_at: Number,
    expires_in: Number,
    refresh_token: String,
    token_type: String
});

var AccessTokenDetails = mongoose.model('access_token_details', accessTokenSchema);

module.exports = AccessTokenDetails;