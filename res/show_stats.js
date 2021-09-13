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

 class ShowStats {
    constructor(contentType) {
      this.card = require('./design/show_stats.json');
      this.contentType = contentType;
      //this.srcUrl = `${srcBaseUrl}/show_stats`;
    }
  
    async renderCard(bot, logger, cardSelection, showStatDocs) {
      try {

        this.card["actions"][0]["card"]["body"][2]["choices"] = showStatDocs;
        //await bot.say('The recent activity sample returns the details of the activities!!\n');
        await bot.sendCard(this.card, "Here's your information.");
        logger.info(`Sent the ${cardSelection} card to space: ${bot.room.title}`);
  
      } catch (err) {
        let msg = 'Failed to render recent activity card.';
        logger.error(`${msg} Error:${err.message}`);
        bot.say(`${msg} Please contact the Webex Developer Support: https://developer.webex.com/support`)
          .catch((e) => logger.error(`Failed to post error message to space. Error:${e.message}`));
      }
    };
  
  };
  
  module.exports = ShowStats;
  