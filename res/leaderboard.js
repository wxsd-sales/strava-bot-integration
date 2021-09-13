/**
 * The Food Order sample from https://developer.ciscospark.com/buttons-and-cards-designer/food_order
 * This sample demonstrates the following types of controls:
 * 
 * Text block with the weight, size, isSubtle, and wrap attributes
 * ImageSet with the imageSize attribute
 * Image
 * Input.ChoiceSet with the style attribute
 * Input.Text with the isMultiline and placeholder attributes
 * Action.ShowCard and Action.Submit
 **/


 class LeaderBoard {
    constructor( contentType) {
      this.card = require('./design/leaderboard.json');
      this.contentType = contentType;
      //this.srcUrl = `${srcBaseUrl}/leaderboard`;
    }
  
    async renderCard(bot, logger, cardSelection, outputArray) {
      try {
        this.card["body"][2]["text"] = outputArray;
        //await bot.say('The leaderboard sample lists the top members in the club for the week!!\n');
        await bot.sendCard(this.card, "Here's your leaderboard stats");
        logger.info(`Sent the ${cardSelection} card to space: ${bot.room.title}`);
  
      } catch (err) {
        let msg = 'Failed to render Leaderboard card example.';
        logger.error(`${msg} Error:${err.message}`);
        bot.say(`${msg} Please contact the Webex Developer Support: https://developer.webex.com/support`)
          .catch((e) => logger.error(`Failed to post error message to space. Error:${e.message}`));
      }
    };
  
  };
  
  module.exports = LeaderBoard;
  