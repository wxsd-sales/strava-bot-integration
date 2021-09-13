const mongoose = require ('mongoose');

var webhookActivityDataSchema = mongoose.Schema({
    activity_id: {
      type: Number,
      required: true,
      sparse: true
    },
    athlete_id: Number,
    event_time: Number,
    subscription_id: Number,
    aspect_type: String,
    object_type: String,
    updated_activity_name: String,
    updated_activity_type: String
});

var WebhookActivityData = mongoose.model('webhook_activity_data', webhookActivityDataSchema);

module.exports = WebhookActivityData;