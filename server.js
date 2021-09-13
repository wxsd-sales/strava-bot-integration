"use strict";

require("dotenv").config();
// Imports dependencies and sets up http server
const express = require("express"),
  cron = require("node-cron"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  axios = require("axios"),
  cors = require("cors"),
  request = require("request"),
  Framework = require("webex-node-bot-framework"),
  logger = require("./logger"),
  WebhookActivityDataRouter = require("./Router/WebhookActivityDataRouter.js"),
  WebhookActivityData = require("./Models/WebhookActivityData.js"),
  UserActivityRouter = require("./Router/UserActivityRouter.js"),
  UserActivityData = require("./Models/UserActivityData.js"),
  ClubDetailsRouter = require("./Router/ClubDetailsRouter.js"),
  ClubDetails = require("./Models/ClubDetails.js"),
  ClubMemberRouter = require("./Router/ClubMemberRouter.js"),
  ClubMemberDetails = require("./Models/ClubMemberDetails.js"),
  ClubActivityRouter = require("./Router/ClubActivityRouter.js"),
  ClubActivityDetails = require("./Models/ClubActivityDetails.js"),
  AuthenticatedAthleteDetails = require("./Models/AuthenticatedAthleteDetails.js"),
  AuthenticatedAthleteRouter = require("./Router/AuthenticatedAthleteRouter.js"),
  AccessTokenRouter = require("./Router/AccessTokenRouter.js"),
  AccessToken = require("./Models/AccessToken.js");

// creates express http server
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("images"));

// Routes go here
app.use("/api/webhook-data", WebhookActivityDataRouter);
app.use("/api/user-activity-data", UserActivityRouter);
app.use("/api/club-details", ClubDetailsRouter);
app.use("/api/club-member-details", ClubMemberRouter);
app.use("/api/club-activity-data", ClubActivityRouter);
app.use("/api/authorized-athlete", AuthenticatedAthleteRouter);
app.use("/api/access-token", AccessTokenRouter);

// Print out some details about the environment we are running in
const package_version = require("./package.json").version;
console.log(`Running app version: ${package_version}`);
console.log(`Running node version: ${process.version}`);

//current directory
// console.log("----------------------")
// console.log(__dirname)

// Sets server port and logs message on success
const port = process.env.PORT || 80;
//app.listen(port, () => console.log(`webhook is listening in the port ${port}`));

// mongodb connection
const uri =
  "mongodb+srv://stravabot:gxy76UPB480YfX37@wxsdsmall.p9xng.mongodb.net/stravaDev?retryWrites=true&w=majority";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("MongoDB Connected!!");
  })
  .catch(err => console.log(err));

/*--------------------------------------------------------------------------------------------------------------*/
// Object for determining full message size of an adaptive card
const CardSize = require("./card-size");
const ActivityCard = require("./res/activity-card.js");
const cardSize = new CardSize();

// Configure the Framework bot for the environment we are running in
var frameworkConfig = {};
var cardsConfig = {};
if (process.env.TOKEN && process.env.PORT) {
  frameworkConfig.token = process.env.TOKEN;
  frameworkConfig.port = process.env.PORT;
  // Adaptive Card with images can take a long time to render
  // Extend the timeout when waiting for a webex API request to return
  frameworkConfig.requestTimeout = 75000;

  // Read the card schema and URL for the source example from environment
  cardsConfig.srcBaseUrl = process.env.CARD_SRC_BASE_URL
    ? process.env.CARD_SRC_BASE_URL
    : "https://developer.ciscospark.com/buttons-and-cards-designer";
  cardsConfig.contentType = process.env.CARD_CONENT_TYPE
    ? process.env.CARD_CONENT_TYPE
    : "application/vnd.microsoft.card.adaptive";
} else {
  logger.error(
    "Cannot start server.  Missing required environment variables TOKEN or PORT"
  );
  process.exit();
}

// The admin user or 'admin space' gets extra notifications about bot
// usage and feedback. If both are set we prefer the space
let adminEmail = "";
let adminSpaceId = "";
let adminsBot = null;
let botName = "";
let botEmail = "the bot";
let warnCardSize = 60000;
if (process.env.ADMIN_SPACE_ID) {
  adminSpaceId = process.env.ADMIN_SPACE_ID;
} else if (process.env.ADMIN_EMAIL) {
  adminEmail = process.env.ADMIN_EMAIL;
} else {
  logger.warn(
    "No ADMIN_SPACE_ID or ADMIN_EMAIL environment variable. \n" +
      "Will not notify anyone about bot activity"
  );
}
// We can use the bot's email and name from environment variables or
// discover them after our first spawn
if (process.env.BOTNAME) {
  botName = process.env.BOTNAME;
}
if (process.env.BOT_EMAIL) {
  botEmail = process.env.BOT_EMAIL;
}

// We can warn about cards that are too big.  If set read the warning size from env
if (process.env.WARNING_CARD_SIZE) {
  warnCardSize = process.env.WARNING_CARD_SIZE;
}

// Card data can be big!
app.use(bodyParser.json({ limit: "50mb" }));

// init framework
var framework = new Framework(frameworkConfig);
framework.start();
framework.messageFormat = "markdown";
logger.info("Starting framework, please wait...");

// Read in the sample cards we'll be using
let SamplePicker = require("./res/sample-picker.js");
let samplePicker = new SamplePicker(cardsConfig.contentType);
let ShowStats = require("./res/show_stats.js");
let showStats = new ShowStats(cardsConfig.contentType);
let LeaderBoard = require("./res/leaderboard.js");
let leaderBoard = new LeaderBoard(cardsConfig.contentType);

framework.on("initialized", function() {
  logger.info("Framework initialized successfully! [Press CTRL-C to quit]");
  if (adminSpaceId && !adminsBot) {
    // Our admin space was not one of the ones found during initialization
    logger.verbose("Attempting to force spawn of the bot for the Admin space");
    framework.webex.memberships
      .list({
        roomId: adminSpaceId,
        personId: framework.person.id
      })
      .then(memberships => {
        if (memberships.items && memberships.items.length) {
          framework.spawn(memberships.items[0]);
        }
      })
      .catch(e =>
        logger.error(`Failed trying to force spawn of admin bot: ${e.message}`)
      );
  }
});

// Called when the framework discovers a space our bot is in
// At startup, (before the framework is fully initialized), this
// is called when the framework discovers an existing spaces.
// After initialization, if our bot is added to a new space the
// framework processes the membership:created event, creates a
// new bot object and generates this event with the addedById param
// The framework can also "lazily" discover older spaces that it missed
// during startup when any kind of activity occurs there.  In these
// cases addedById will always be null
// TL;DR we use the addedById param to see if this is a new space for our bot
framework.on("spawn", function(bot, id, addedById) {
  // Do some housekeeping if the bot for our admin space hasn't spawned yet
  if (!adminsBot) {
    tryToInitAdminBot(bot, framework);
  }

  // See if this instance is the 1-1 space with the admin
  if (
    !adminsBot &&
    adminEmail &&
    bot.isDirect &&
    bot.isDirectTo.toLocaleLowerCase() === adminEmail.toLocaleLowerCase()
  ) {
    adminsBot = bot;
  }

  if (!addedById) {
    // Framework discovered an existing space with our bot, log it
    if (!framework.initialized) {
      logger.info(
        `During startup framework spawned bot in existing room: ${bot.room.title}`
      );
    } else {
      logger.info(
        `Bot object spawn() in existing room: "${bot.room.title}" ` +
          `where activity has occured since our server started`
      );
    }
  } else {
    logger.info(`Our bot was added to a new room: ${bot.room.title}`);
    if (adminsBot) {
      adminsBot
        .say(`${botName} was added to a space: ${bot.room.title}`)
        .catch(e =>
          logger.error(
            `Failed to update to Admin about a new space our bot is in. Error:${e.message}`
          )
        );
    }
    showHelp(bot);
  }
});

// Respond to message input
var responded = false;

// A secret for our admin only
framework.hears("getAdminStats", function(bot) {
  logger.info("Processing getAdminStats Request for " + bot.isDirectTo);
  if (adminEmail === bot.isDirectTo) {
    updateAdmin(`${botName} has been added to the following spaces:`, true);
  } else {
    bot
      .say("Unauthorized Request")
      .catch(e =>
        logger.error(
          `Failed to post Unauthorized Request message to space. Error:${e.message}`
        )
      );
  }
  responded = true;
});

// All bots should respond to help!
framework.hears(/help/i, function(bot) {
  responded = true;
  showHelp(bot);
});

// send an the sample card in response to any input without files
framework.hears(/.*/, function(bot, trigger) {
  if (!responded && !trigger.message.files) {
    logger.info(
      `Processing a message "${trigger.message.text}" from space "${bot.room.title}".`
    );
    samplePicker.renderCard(bot, logger);
  }
  responded = false;
});

// If files were sent, try to render them as cards
framework.on("files", function(bot, trigger) {
  let response =
    "Will attempt to render your message file attachments as cards";
  if (trigger.text) {
    response += ", while ignoring any message text...";
  } else {
    response += "...";
  }
  response +=
    "Don't forget! You can send me any text message to get back to the sample picker.";
  logger.info(
    `Processing a message "${trigger.message.text}" from space "${bot.room.title}" with files: ${trigger.message.files}`
  );
  bot
    .reply(trigger.message, response)
    .then(() => renderJsonFileRequest(bot, trigger))
    .catch(e =>
      logger.error(`Failed to respond to posted files: ${e.message}`)
    );
});

// Process an Action.Submit button press
framework.on("attachmentAction", function(bot, trigger) {
  if (trigger.type != "attachmentAction") {
    throw new Error(
      `Invaid trigger type: ${trigger.type} in attachmentAction handler`
    );
  }
  let attachmentAction = trigger.attachmentAction;
  if (attachmentAction.inputs.cardType === "samplePicker") {
    if (attachmentAction.inputs.customRequested) {
      logger.info(
        `Got a request to render the ${attachmentAction.inputs.cardType} card from space: ${bot.room.title}`
      );
      //customJsonInput.renderCard(bot, logger);
    } else {
      console.log("Render selected card")
      renderSelectedCard(bot, attachmentAction.inputs.cardSelection);
    }
  } else {
    console.log("Process sample card")
    processSampleCardResponse(bot, attachmentAction, trigger.person);
  }
  logger.verbose(
    `Got an attachmentAction:\n${JSON.stringify(attachmentAction, null, 2)}`
  );
});

// Render the selected sample
function renderSelectedCard(bot, cardSelection) {
  logger.info(
    `Got a request to render the ${cardSelection} card from space: ${bot.room.title}`
  );
  switch (cardSelection) {
    case "leaderBoard":
      var clubActivityResult = null;
      ClubActivityDetails.find({})
        .sort({ distance: -1 })
        .exec(function(err, docs) {
          clubActivityResult = docs;
          let outputArray = [];
          var hashMap = new Map();
          for (var member of clubActivityResult) {
            var name = member.firstname + " " + member.lastname;
            if (name in hashMap) {
              hashMap[name] = hashMap[name] + member.distance;
            } else {
              hashMap[name] = member.distance;
            }
          }

          var array = [];
          for (var key in hashMap) {
            array.push({
              name: key,
              value: hashMap[key]
            });
          }

          var sorted = array.sort(function(a, b) {
            return a.value < b.value ? 1 : b.value < a.value ? -1 : 0;
          });

          var leaderboardString = "";
          var count = 1;
          for (var key in sorted) {
            if (count <= 10) {
              switch (count) {
                case 1:
                  count++;
                  leaderboardString +=
                    "🥇 " +
                    sorted[key].name +
                    "  -  " +
                    (sorted[key].value / 1000).toFixed(2) +
                    " kms" +
                    "\n";
                  break;

                case 2:
                  count++;
                  leaderboardString +=
                    "🥈 " +
                    sorted[key].name +
                    "  -  " +
                    (sorted[key].value / 1000).toFixed(2) +
                    " kms" +
                    "\n";
                  break;

                case 3:
                  count++;
                  leaderboardString +=
                    "🥉 " +
                    sorted[key].name +
                    "  -  " +
                    (sorted[key].value / 1000).toFixed(2) +
                    " kms" +
                    "\n";
                  break;

                default:
                  count++;
                  leaderboardString +=
                    "🏅 " +
                    sorted[key].name +
                    "  -    " +
                    (sorted[key].value / 1000).toFixed(2) +
                    " kms" +
                    "\n";
              }
            }
          }
          //console.log(outputArray)
          leaderBoard.renderCard(bot, logger, cardSelection, leaderboardString);
        });
      break;

    case "showStats":
      var authorizedClubMemberResult = null;
      var memberList = [];
      AuthenticatedAthleteDetails.find({})
        .sort({ name: 1 })
        .exec(function(err, docs) {
          //res.json(docs)
          authorizedClubMemberResult = docs;
          //console.log("Authorized clubMember  " + docs);

          authorizedClubMemberResult.map((data, index) => {
            memberList.push({
              title: data.fullname,
              value: data.fullname
            });
          });

          showStats.renderCard(bot, logger, cardSelection, memberList);
        });
      break;

    default:
      logger.error(
        `Sample Picker Card cardSelection:${attachmentAction.inputs.cardType}!`
      );
      bot
        .say("Please make a choice from the drop down list")
        .catch(e =>
          logger.error(
            `Failed to post picker instructions message to space. Error:${e.message}`
          )
        );
  }
}

// Process the button press for a specific card
function processSampleCardResponse(bot, attachmentAction, person) {
  logger.info(
    `Got a button push on card ${attachmentAction.inputs.cardType} from space: ${bot.room.title}`
  );
  console.log("attachmentAction.inputs.cardType")
  console.log(attachmentAction.inputs.cardType)
  switch (attachmentAction.inputs.cardType) {
    case "samplePicker":
      // Display the chosen card
      activityUpdate.handleSubmit(attachmentAction, person, bot, logger);
      break;

    default:
      // let msg = `This bot doesn't currently do any logic for the button that you pressed, but here ` +
      //   ` is the body of the attachmentAction so you can see what your app would need to process:\n\n` +
      //   '```json\n' + `${JSON.stringify(attachmentAction, null, 2)}`;
      var friendChoice = attachmentAction.inputs.friend;
      var roomId = attachmentAction.roomId;
      var messageId = attachmentAction.messageId;
      var userObj = null;
      var activityObj = null;

      AuthenticatedAthleteDetails.findOne({ fullname: friendChoice }).exec(
        function(err, doc) {
          userObj = doc;
          //console.log("userObj --------------------");
          //console.log(userObj);
          if (userObj != null) {
            UserActivityData.findOne({ athlete_id: userObj.athlete_id })
              .sort({ start_date_local: -1 })
              .exec(function(err, doc) {
                //console.log(doc);
                activityObj = doc;
                var msg = "";
                var activityCard = new ActivityCard();
                if (activityObj != null) {
                  activityCard.renderCard(
                    bot,
                    logger,
                    activityObj,
                    friendChoice,
                    roomId
                  );
                  //msg = JSON.stringify(activityObj);
                } else {
                  msg = "Activity could not be found";
                  bot.reply(attachmentAction, msg).catch(e => {
                    let errorMsg = `Failed handling a button press: ${e.message}`;
                    this.logger.error(errorMsg);
                    bot.say(errorMsg);
                  });
                }
              });
          } else {
            var msg = "Oops! Athlete has to post an activity.";
            bot.reply(attachmentAction, msg).catch(e => {
              let errorMsg = `Failed handling a button press: ${e.message}`;
              this.logger.error(errorMsg);
              bot.say(errorMsg);
            });
          }
        }
      );
  }
}

async function showHelp(bot) {
  try {
    await bot.say(
      "This bot provides the activity stats of a Strava club member"
    );
    samplePicker.renderCard(bot, logger);
  } catch (e) {
    logger.error(`Failed to post help message to space. Error:${e.message}`);
  }
}

function updateAdmin(message, listAll = false) {
  if (!adminsBot) {
    return;
  }
  try {
    if (listAll) {
      let count = 0;
      message += "\n";
      framework.bots.forEach(function(bot) {
        message += "* " + bot.room.title + "\n";
        count += 1;
      });
      message += `\n\nFor a total of ${count} instances.`;
    }
    // Don't notify about users after a scheduled shutdown/restart
    if (
      !lastShutdown ||
      lastShutdown.isBefore(moment().subtract(5, "minutes"))
    ) {
      adminsBot
        .say({ markdown: message })
        .catch(e =>
          logger.error(
            `Failed to post shutdown message to admin. Error:${e.message}`
          )
        );
    }
  } catch (e) {
    logger.warn("Unable to spark Admin the news " + message);
    logger.warn("Reason: " + e.message);
  }
}

function tryToInitAdminBot(bot, framework) {
  // Set our bot's email -- this is used by our health check endpoint
  if (botEmail === "the bot") {
    // should only happen once
    botEmail = bot.person.emails[0];
    botName = bot.person.displayName;
  }
  // See if this is the bot that belongs to our admin space
  if (
    !adminsBot &&
    bot.isDirect &&
    adminEmail &&
    bot.isDirectTo.toLocaleLowerCase() === adminEmail.toLocaleLowerCase()
  ) {
    adminsBot = bot;
    framework.adminsBot = adminsBot;
  } else if (!adminsBot && adminSpaceId && bot.room.id === adminSpaceId) {
    adminsBot = bot;
    framework.adminsBot = adminsBot;
  }
}

// Health Check
app.get("/", function(req, res) {
  res.send(
    `I'm alive.  To use this app add ${botEmail} to a Webex Teams space.`
  );
});

// start express server
var server = app.listen(frameworkConfig.port, function() {
  framework.debug("Framework listening on port %s", frameworkConfig.port);
});

// gracefully shutdown (ctrl-c)
process.on("SIGINT", function() {
  framework.debug("stoppping...");
  server.close();
  framework.stop().then(function() {
    process.exit();
  });
});

/*--------------------------------------------------------------------------------------------------------------*/

cron.schedule("* * * * *", function() {
  // get the epoch time of the current time
  let currentTime = Math.floor(new Date().getTime() / 1000);

  AccessToken.find({ expires_at: { $lt: currentTime } }).exec(function(
    err,
    docs
  ) {
    docs.map((data, index) => {
      console.log("dataa ----------");
      console.log(data);
      axios
        .post(
          "https://www.strava.com/oauth/token",
          {
            client_id: "68776",
            client_secret: "a03c44e89c54641b8eaff89a898bd6d19ee276b7",
            grant_type: "refresh_token",
            refresh_token: data.refresh_token
          },
          { responseType: "application/json" }
        )
        .then(
          response => {
            console.log("Updated ---- ");
            console.log(response.data);

            AccessToken.findOne({ athlete_id: data.athlete_id }, function(
              err,
              doc
            ) {
              console.log("Access token document ----------");
              console.log(doc);
            });

            AccessToken.findOneAndUpdate(
              { athlete_id: data.athlete_id },
              {
                expires_in: response.data.expires_in,
                expires_at: response.data.expires_at,
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                token_type: response.data.token_type
              },
              { new: true },
              function(err, doc) {
                console.log("Access token find one and update -----------");
                //console.log(accessToken)
                if (err) console.log(err);
                //console.log('Succesfully saved.');
              }
            );
          },
          error => {
            console.log(error);
          }
        );
    });
  });

  console.log("running a task every minute");
});

/*
app.get('/webhook', (req, res) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = "STRAVA";
  // Parses the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  console.log("GET /webhook:")
  console.log(mode);
  console.log(token);
  console.log(challenge);
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Verifies that the mode and token sent are valid
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {     
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.json({"hub.challenge":challenge});  
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

app.post('/webhook', (req, res) => {
  console.log("webhook event received!", req.query, req.body);
  res.status(200).send('EVENT_RECEIVED');
});
*/
// Creates the endpoint for our webhook
app.post("/webhook", (req, res) => {
  console.log("webhook event received!", req.query, req.body);
  var body = req.body;
  //console.log("body ------------------")
  //console.log(body)

  var webhookActivityData = new WebhookActivityData();

  webhookActivityData.aspect_type = body.aspect_type;
  webhookActivityData.event_time = body.event_time;
  webhookActivityData.activity_id = body.object_id;
  webhookActivityData.object_type = body.object_type;
  webhookActivityData.athlete_id = body.owner_id;
  webhookActivityData.subscription_id = body.subscription_id;

  if ((body.updates.title || body.updates.type) != null) {
    webhookActivityData.updated_activity_name = body.updates.title;
    webhookActivityData.updated_activity_type = body.updates.type;
  }

  //console.log("webhook data ---------- " + webhookActivityData);
  webhookActivityData.save();

  AccessToken.findOne({ athlete_id: body.owner_id }, function(err, res) {
    var accessToken = res.access_token;
    console.log("----------------");
    console.log(accessToken)
    //console.log("----------------");

    /*-------------------------------------------------------------------------------------------------------*/
    // authorized athlete details

    axios
      .get(`https://www.strava.com/api/v3/athlete?access_token=${accessToken}`)
      .then(function(response) {
        onAuthenticatedAthlete(response);
      })
      .catch(function(error) {
        console.log(error);
      });

    function onAuthenticatedAthlete(response) {
      var array = response;
      //var arrayLength = Object.keys(array.data).length
      //console.log("Authenticated Athlete Details: " + arrayLength)
      //console.log(array.data)
      //for(var i = 0; i < arrayLength; i++) {
      var athleteData = new AuthenticatedAthleteDetails();
      athleteData.athlete_id = array.data.id;
      athleteData.username = array.data.username;
      athleteData.firstname = array.data.firstname;
      athleteData.lastname = array.data.lastname;
      athleteData.fullname = array.data.firstname + " " + array.data.lastname;
      athleteData.nickname =
        array.data.firstname + " " + array.data.lastname.slice(0, 1) + ".";
      athleteData.city = array.data.city;
      athleteData.state = array.data.state;
      athleteData.country = array.data.country;
      athleteData.clubs = array.data.clubs;
      //console.log(athleteData)
      //athleteData.save();
      //}

      AuthenticatedAthleteDetails.findOne(
        {
          athlete_id: athleteData.athlete_id,
          username: athleteData.username,
          firstname: athleteData.firstname,
          lastname: athleteData.lastname,
          fullname: athleteData.fullname,
          nickname: athleteData.nickname,
          city: athleteData.city,
          state: athleteData.state,
          country: athleteData.country,
          clubs: athleteData.clubs
        },
        function(err, res) {
          if (!res) {
            athleteData.save();
            console.log("Added an authorized user");
          }
        }
      );
    }

    /*-------------------------------------------------------------------------------------------------------*/
    // club activity details
    if (body.aspect_type == "delete") {
      console.log("Club activity - Delete block");
      console.log(body.object_id);
      UserActivityData.findOne({ activity_id: body.object_id }, function(
        error,
        result
      ) {
        if (error) {
          console.log(error);
        } else {
          console.log("Club Delete response");
          console.log(result);
          var activity_name_deletion = result.name;
          console.log("activity_name_deletion ------------------");
          console.log(activity_name_deletion);
          //console.log("activity_name_deletion ------------------");
        }

        ClubActivityDetails.deleteOne(
          { name: activity_name_deletion },
          function(err, res) {
            if (err) console.log(err);
            else console.log("Club activity deletion successful");
          }
        );
      });
    } else {
      axios
        .get(
          `https://www.strava.com/api/v3/clubs/957244/activities?access_token=${accessToken}`
        )
        .then(function(response) {
          onClubMemberActivitySuccess(response);
        })
        .catch(function(error) {
          console.log(error);
        });

      function onClubMemberActivitySuccess(response) {
        //console.log(response)
        var array = response;
        var arrayLength = array.data.length;
        console.log("Club Member Activity Details: " + arrayLength);
        //console.log(array.data)
        //for(var i = 0; i < arrayLength; i++) {
        array.data.map(data => {
          //console.log(clubMemberActivityData)

          ClubActivityDetails.findOne(
            {
              name: data.name,
              firstname: data.athlete.firstname,
              lastname: data.athlete.lastname,
              distance: data.distance,
              moving_time: data.moving_time,
              elapsed_time: data.elapsed_time,
              total_elevation_gain: data.total_elevation_gain,
              type: data.type
              // name: clubMemberActivityData.name,
              // firstname: clubMemberActivityData.firstname,
              // lastname: clubMemberActivityData.lastname,
              // distance: clubMemberActivityData.distance,
              // moving_time: clubMemberActivityData.moving_time,
              // elapsed_time: clubMemberActivityData.elapsed_time,
              // total_elevation_gain: clubMemberActivityData.total_elevation_gain
            },
            function(err, res) {
              if (!res) {
                //console.log(res)
                var clubMemberActivityData = new ClubActivityDetails();
                clubMemberActivityData.name = data.name;
                clubMemberActivityData.firstname = data.athlete.firstname;
                clubMemberActivityData.lastname = data.athlete.lastname;
                clubMemberActivityData.distance = data.distance;
                clubMemberActivityData.moving_time = data.moving_time;
                clubMemberActivityData.elapsed_time = data.elapsed_time;
                clubMemberActivityData.total_elevation_gain =
                  data.total_elevation_gain;
                clubMemberActivityData.type = data.type;

                clubMemberActivityData.save();
                console.log("Added club activity data");
                console.log(clubMemberActivityData);
              }
            }
          );
        });
      }
    }

    /*-------------------------------------------------------------------------------------------------------*/
    // get user activity details using webhook activity_id and access token

    if (body.aspect_type == "delete") {
      console.log("Delete block");
      UserActivityData.deleteOne({ activity_id: body.object_id }, function(
        err,
        res
      ) {
        if (err) console.log(err);
        else console.log("Deletion successful");
      });
    } else {
      axios
        .get(
          `https://www.strava.com/api/v3/activities/${body.object_id}?access_token=${accessToken}`
        )
        .then(function(response) {
          onSuccess(response);
          //console.log(body.object_id);
        })
        .catch(function(error) {
          console.log(error);
        });

      function onSuccess(response) {
        var array = response;
        var userActivityData = new UserActivityData();
        //console.log("----- User Activity Data ------");
        //console.log(array.data)
        if (body.aspect_type == "update") {
          console.log("Update block");
          UserActivityData.findOneAndUpdate(
            { activity_id: body.object_id },
            {
              athlete_id: array.data.athlete.id,
              name: array.data.name,
              distance: array.data.distance,
              moving_time: array.data.moving_time,
              average_speed: array.data.average_speed,
              start_date_local: array.data.start_date_local,
              map: array.data.map.summary_polyline,
              start_latlng: array.data.start_latlng,
              end_latlng: array.data.end_latlng,
              elapsed_time: array.data.elapsed_time,
              elev_high: array.data.elev_high,
              elev_low: array.data.elev_low,
              location_country: array.data.location_country,
              recent_picture: array.data.photos.primary.urls["600"]
            },
            {
              new: true,
              upsert: true
            },
            function(err, res) {
              if (err) {
                console.log(err);
              } else {
                //console.log(arrays.data.photos.primary.urls["600"]);
                console.log("Update activity success");
              }
            }
          );
        } else if (body.aspect_type == "create") {
          console.log("Create block");
          console.log("ARRAY - DATA - URL - check")
          console.log(array.data)
          //console.log(array.data.photos.primary.urls["600"])
          // UserActivityData.exists({ activity_id: array.data.id }, function(err, doc) {
          //   if (err) {
          //     console.log(err);
          //   } else {
              userActivityData.activity_id = array.data.id;
              userActivityData.athlete_id = array.data.athlete.id;
              userActivityData.name = array.data.name;
              userActivityData.distance = array.data.distance;
              userActivityData.moving_time = array.data.moving_time;
              userActivityData.average_speed = array.data.average_speed;
              userActivityData.start_date_local = array.data.start_date_local;
              userActivityData.map = array.data.map.summary_polyline;
              userActivityData.start_latlng = array.data.start_latlng;
              userActivityData.end_latlng = array.data.end_latlng;
              userActivityData.elapsed_time = array.data.elapsed_time;
              userActivityData.elev_high = array.data.elev_high;
              userActivityData.elev_low = array.data.elev_low;
              userActivityData.location_country = array.data.location_country;
              if (array.data.photos.primary != null) {
                userActivityData.recent_picture =
                  array.data.photos.primary.urls["600"];
                console.log(array.data.photos.primary.urls["600"]);
              }
              userActivityData.save();
              console.log("******************user added successfully");
            //}
          //});
        }
      }
    }
    /*-------------------------------------------------------------------------------------------------------*/
    // Club Details

    axios
      .get(
        `https://www.strava.com/api/v3/athlete/clubs?access_token=${accessToken}`
      )
      .then(function(response) {
        onClubSuccess(response);
      })
      .catch(function(error) {
        console.log(error);
      });

    function onClubSuccess(response) {
      var array = response;
      var arrayLength = array.data.length;
      console.log("Club Details: " + arrayLength);
      //for(var i = 0; i < arrayLength; i++) {
      array.data.map(data => {
        console.log("------Data - club--------");
        console.log(data);

        ClubDetails.findOne(
          {
            id: data.id
            //  name: data.name,
            //  sport_type: data.sport_type,
            //  member_count: data.member_count,
            //  country: data.country,
            //  city: data.city,
            //  state: data.state,
            //  verified: data.verified
          },
          function(err, res) {
            //console.log("----Result------");
            //console.log(res);
            //console.log("-----error-----");
            //console.log(err);
            //console.log("---------------");
            if (!res) {
              console.log("Inside - club creation");
              var clubData = new ClubDetails();
              clubData.id = data.id;
              clubData.name = data.name;
              clubData.sport_type = data.sport_type;
              clubData.member_count = data.member_count;
              clubData.country = data.country;
              clubData.city = data.city;
              clubData.state = data.state;
              clubData.verified = data.verified;
              clubData.save();
              console.log("Added club details");
            }
          }
        );
      });
    }

    /*-------------------------------------------------------------------------------------------------------*/
    // club member details

    axios
      .get(
        `https://www.strava.com/api/v3/clubs/957244/members?access_token=${accessToken}`
      )
      .then(function(response) {
        onClubMemberSuccess(response);
      })
      .catch(function(error) {
        console.log(error);
      });

    function onClubMemberSuccess(response) {
      var array = response;
      var arrayLength = array.data.length;
      //console.log(array.data)
      //console.log("Club Member Details: " + arrayLength)
      // for(var i = 0; i < arrayLength; i++) {

      array.data.map(data => {
        //console.log(clubMemberData)
        ClubMemberDetails.findOne(
          {
            firstname: data.firstname,
            lastname: data.lastname,
            name: data.firstname + " " + data.lastname,
            membership: data.membership,
            admin: data.admin,
            owner: data.owner
          },
          function(err, res) {
            if (!res) {
              var clubMemberData = new ClubMemberDetails();
              clubMemberData.firstname = data.firstname;
              clubMemberData.lastname = data.lastname;
              clubMemberData.name = data.firstname + " " + data.lastname;
              clubMemberData.membership = data.membership;
              clubMemberData.admin = data.admin;
              clubMemberData.owner = data.owner;
              clubMemberData.save();
              console.log("Added a club member");
            }
          }
        );
      });
    }
  });

  /*-------------------------------------------------------------------------------------------------------*/

  res.status(200).send("EVENT_RECEIVED");
});

/*-------------------------------------------------------------------------------------------------------*/

// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = "STRAVA";
  // Parses the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Verifies that the mode and token sent are valid
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.json({ "hub.challenge": challenge });
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
