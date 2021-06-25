import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import axios from 'axios';
import ActivityRouter from './Routes/ActivityRouter.js';
import ActivityDetails from './models/ActivityDetails.js';
import ClubRouter from './Routes/ClubRouter.js';
import ClubDetails from './models/ClubDetails.js';
import ClubMemberRouter from './Routes/ClubMemberRouter.js';
import ClubMemberDetails from './models/ClubMemberDetails.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes go here
app.use('/api/activities', ActivityRouter);
app.use('/api/club-details', ClubRouter);
app.use('/api/club-member-details', ClubMemberRouter);


app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

// mongodb connection
const uri = 'mongodb+srv://stravabot:gxy76UPB480YfX37@wxsdsmall.p9xng.mongodb.net/stravaDev?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB Connected!!")
}).catch(err => console.log(err))


//Get the activity details of the user

axios.get('https://www.strava.com/api/v3/activities?access_token=a808db4d51f2248835c31241f608c9aa139ffd38')
  .then(function (response) {
    onSuccess(response)
  })
  .catch(function (error) {
    console.log(error);
  });

function onSuccess(response) {
    var array = response;
    var arrayLength = Object.keys(array.data).length 
    console.log("Activity Array length: " + arrayLength)
    
    for(var i = 0; i < arrayLength; i++) {

            var upData = new ActivityDetails()
            upData.activity_id = array.data[i].id;
            upData.name = array.data[i].name;
            upData.athlete = array.data[i].athlete.id;
            upData.distance = array.data[i].distance;
            upData.moving_time = array.data[i].moving_time;
            upData.average_speed = array.data[i].average_speed;
            upData.map = array.data[i].map.summary_polyline;
            upData.start_latitude = array.data[i].start_latitude;
            upData.start_longitude = array.data[i].start_longitude;
            upData.end_latitude = array.data[i].end_latitude;
            upData.end_latitude = array.data[i].end_latitude;
            upData.elapsed_time = array.data[i].elapsed_time;
            upData.elev_high = array.data[i].elev_high;
            upData.elev_low = array.data[i].elev_low;
            upData.location_country = array.data[i].location_country;
            upData.save();
    }
}


// Club Member Details

axios.get('https://www.strava.com/api/v3/clubs/950919/members?access_token=a808db4d51f2248835c31241f608c9aa139ffd38')
  .then(function (response) {
    onClubMemberSuccess(response)
  })
  .catch(function (error) {
    console.log(error);
  });


function onClubMemberSuccess(response) {
    var array = response;
    var arrayLength = Object.keys(array.data).length 
    console.log("Club Member Details: " + arrayLength)
    for(var i = 0; i < arrayLength; i++) {

      var clubMemberData = new ClubMemberDetails()
      clubMemberData.firstname = array.data[i].firstname;
      clubMemberData.lastname = array.data[i].lastname;
      clubMemberData.membership = array.data[i].membership;
      clubMemberData.admin = array.data[i].admin;
      clubMemberData.owner = array.data[i].owner;
      console.log(clubMemberData)
      clubMemberData.save()
    }
}

//Club Details

axios.get('https://www.strava.com/api/v3/athlete/clubs?access_token=a808db4d51f2248835c31241f608c9aa139ffd38')
  .then(function (response) {
    onClubSuccess(response)
  })
  .catch(function (error) {
    console.log(error);
  });


function onClubSuccess(response) {
  var array = response;
  var arrayLength = Object.keys(array.data).length 
  console.log("Club Details: " + arrayLength)
 for(var i = 0; i < arrayLength; i++) {
    var clubData = new ClubDetails()
    clubData.id = array.data[i].id;
    clubData.name = array.data[i].name;
    clubData.sport_type = array.data[i].sport_type;
    clubData.member_count = array.data[i].member_count;
    clubData.country = array.data[i].country;
    clubData.city = array.data[i].city;
    clubData.state = array.data[i].state;
    clubData.verified = array.data[i].verified;
    console.log(clubData)
    clubData.save();
  }
}


//Club Member Details

axios.get('https://www.strava.com/api/v3/clubs/950919/activities?access_token=a808db4d51f2248835c31241f608c9aa139ffd38')
  .then(function (response) {
    onClubMemberSuccess(response)
  })
  .catch(function (error) {
    console.log(error);
  });

  name: String,
  firstname: String,
  lastname: String,
  distance: Number,
  moving_time: Number,
  elapsed_time: Number,
  total_elevation_gain: Number,
  type: String


function onClubMemberSuccess(response) {
  var array = response;
  var arrayLength = Object.keys(array.data).length 
  console.log("Club Member Details: " + arrayLength)
 for(var i = 0; i < arrayLength; i++) {
    var clubMemberData = new ClubMemberDetails()
    clubMemberData.name = array.data[i].name;
    clubMemberData.firstname = array.data[i].athlete.firstname;
    clubMemberData.lastname = array.data[i].athlete.lastname;
    clubMemberData.distance = array.data[i].distance;
    clubMemberData.moving_time = array.data[i].moving_time;
    clubMemberData.elapsed_time = array.data[i].elapsed_time;
    clubMemberData.total_elevation_gain = array.data[i].total_elevation_gain;
    clubMemberData.type = array.data[i].type;

    console.log(clubMemberData)
    //clubMemberData.save();
  }
}
