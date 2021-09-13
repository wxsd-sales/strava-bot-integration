var axios = require("axios");
class ActivityCard {
  constructor(srcBaseUrl, contentType) {
    this.card = require("./design/activity_card.json");
    this.contentType = contentType;
  }

  async renderCard(bot, logger, activityJSON, friendChoice, roomId) {
    try {
      //console.log("-------------------")
      //console.log(activityJSON)
      let map_key = "AIzaSyB7zHW8oTnccu56JNs3Fw_cK9rDC8wFWQY"; //process.env.GOOGLE_API_KEY
      let imgUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap&path=enc:${activityJSON.map}&key=${map_key}`;

      const fs = require("fs");
      const request = require("request");

      const download = (url, path, callback) => {
        request.head(url, (err, res, body) => {
          request(url)
            .pipe(fs.createWriteStream(path))
            .on("close", callback);
        });
      };

      //const imageName = activityJSON.map + '.jpg'
      const imageName = activityJSON.activity_id + "-googleMap.png";
      const url = imgUrl;
      const path = `./images/${imageName}`;

      const urlPath = "https://wxstrava-be.glitch.me/" + imageName;
      download(url, path, () => {
        console.log("✅ Done!");
        //console.log(activityJSON.recent_picture)
      });
      // console.log('\"'+ `https://4cedb439c8e3.eu.ngrok.io/${imageName}` + '\"')

      console.log(urlPath);
      //console.log("-------------")
      //console.log(activityJSON)
      //console.log("-------------")
      var locationFlag = false;
      if (activityJSON.location_country != null) {
        locationFlag = true;
      }

      this.card["body"][2]["text"] = "✨ Activity name : " + activityJSON.name;
      this.card["body"][3]["text"] = "✨ Athlete name : " + friendChoice;
      this.card["body"][4]["text"] =
        "✨ Moving Time  : " +
        (activityJSON.moving_time / 60).toFixed(2) +
        " mins";
      this.card["body"][5]["text"] =
        "✨ Distance        : " +
        (activityJSON.distance / 1000).toFixed(2) +
        " kms";
      this.card["body"][6]["text"] =
        "✨ Location        : " + activityJSON.location_country;
      this.card["body"][6]["isVisible"] = locationFlag;
      this.card["body"][7]["url"] = urlPath;

      //await bot.say('The activity card lists the recent activity of members in the club for the week!!\n');
      await bot.sendCard(
        this.card,
        "Here's your recent activity stats"
      ).then((res) => {
        if (activityJSON.recent_picture != null) {
        var data = JSON.stringify({
          "roomId": `${res.roomId}`,
          "parentId": `${res.id}`,
          "markdown": `Here is ${friendChoice}'s recent post 📸`,
          "files": [`${activityJSON.recent_picture}`]
        });

        var config = {
          method: "post",
          url: "https://webexapis.com/v1/messages",
          headers: {
            Authorization: `Bearer ${process.env.TOKEN}`,
            "Content-Type": "application/json"
          },
          data: data
        };

        axios(config)
          .then(function(response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      });

      //logger.info(`Sent the ${cardSelection} card to space: ${bot.room.title}`);

      
    } catch (err) {
      let msg = "Failed to render activity card example.";
      logger.error(`${msg} Error:${err.message}`);
      //console.log("#################")
      console.log(err);
      bot
        .say(
          `${msg} Please contact the Webex Developer Support: https://developer.webex.com/support`
        )
        .catch(e =>
          logger.error(
            `Failed to post error message to space. Error:${e.message}`
          )
        );
    }
  }
}

module.exports = ActivityCard;
