//club details

axios.get('https://www.strava.com/api/v3/athlete/clubs?access_token=c728bc3da1fab7e9b0d7772616be0db1ac332230')
  .then(function (response) {
    onClubSuccess(response)
  })
  .catch(function (error) {
    console.log(error);
  });


var clubSchema = mongoose.Schema({
    id: Number,
    name: String,
    sport_type: String,
    member_count: Number,
    country: String,
    city: String,
    state: String,
    verified: Boolean
});
var ClubDetails = mongoose.model('club-detail', clubSchema);

function onClubSuccess(response) {
    var array = response;
  //  var arraytobe = response;
  var arrayLength = Object.keys(array.data).length 
    console.log("Club Detatils: " + arrayLength)
   for(var i = 0; i < arrayLength; i++) {
    
      var id = array.data[i].id;
      var name = array.data[i].name;
      var sportType = array.data[i].sport_type;
      var memberCount = array.data[i].member_count;
      var country = array.data[i].country;
      var city = array.data[i].city;
      var state = array.data[i].state;
      var verified = array.data[i].verified;

      assignClubValue(
        id, 
        name, 
        sportType, 
        memberCount,
        country, 
        city, 
        state,
        verified
      )
    }
}

function assignClubValue(
  id, 
  name, 
  sportType, 
  memberCount,
  country, 
  city, 
  state,
  verified) {

   var upData = new ClubDetails()
      upData.id = array.data[i].id;
      upData.name = array.data[i].name;
      upData.sport_type = array.data[i].sport_type;
      upData.member_count = array.data[i].member_count;
      upData.country = array.data[i].country;
      upData.city = array.data[i].city;
      upData.state = array.data[i].state;
      upData.verified = array.data[i].verified;

      //upData.save();
}


//club-member details

axios.get('https://www.strava.com/api/v3/clubs/950919/members?access_token=c728bc3da1fab7e9b0d7772616be0db1ac332230')
  .then(function (response) {
    onClubMemberSuccess(response)
  })
  .catch(function (error) {
    console.log(error);
  });


var clubMemberSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    membership: String,
    admin: Boolean,
    owner: Boolean
});
var Club = mongoose.model('club-member-detail', clubMemberSchema);

function onClubMemberSuccess(response) {
    var array = response;
  //  var arraytobe = response;
  var arrayLength = Object.keys(array.data).length 
    console.log("Club Member Detatils: " + arrayLength)
   for(var i = 0; i < arrayLength; i++) {
    
      var firstname = array.data[i].firstname;
      var lastname = array.data[i].lastname;
      var membership = array.data[i].membership;
      var admin = array.data[i].admin;
      var owner = array.data[i].owner;

      assignClubMemberValue(
        firstname, 
        lastname, 
        membership, 
        admin,
        owner
      )
    }
}

function assignClubMemberValue(
  firstname, 
  lastname, 
  membership, 
  admin,
  owner
  ) {

   var upData = new Club()
      upData.firstname = firstname;
      upData.lastname = lastname;
      upData.membership = membership;
      upData.admin = admin;
      upData.owner = owner;

      //upData.save();
}