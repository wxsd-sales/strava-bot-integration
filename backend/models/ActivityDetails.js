import mongoose from 'mongoose';

var repSchema = mongoose.Schema({
    activity_id: {
        type: Number,
        unique: true,
        index: true,
        required: true
      },
      name: String,
      athlete: Number,
      distance: Number,
      moving_time: Number,
      average_speed: Number,
      map: String,
      start_latitude: Number,
      start_longitude: Number,
      end_latitude: Number,
      end_longitude: Number,
      elapsed_time: Number,
      elev_high: Number,
      elev_low: Number,
      location_country: String,
});
var ActivityDetails = mongoose.model('Activity_Details', repSchema);

export default ActivityDetails;



// import mongoose from 'mongoose';
// const Schema = mongoose.Schema;
// const ActivityDetails = new Schema({
//     title: { type: String },
//     author: { type: String }
// })
// export default mongoose.model('test', ActivityDetails)