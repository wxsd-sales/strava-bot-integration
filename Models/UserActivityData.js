const mongoose = require ('mongoose');

var userActivitySchema = mongoose.Schema({
    activity_id: {
        type: Number,
        unique: true,
        index: true,
        required: true
      },
      name: String,
      athlete_id: Number,
      distance: Number,
      moving_time: Number,
      average_speed: Number,
      start_date_local: Date,
      map: String,
      start_latlng: Array,
      end_latlng: Array,
      elapsed_time: Number,
      elev_high: Number,
      elev_low: Number,
      location_country: String,
      recent_picture: String
});
var UserActivityData = mongoose.model('user_activity_data', userActivitySchema);

module.exports = UserActivityData;