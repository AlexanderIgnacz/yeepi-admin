var mongoose = require('mongoose');

var settingsModel = function () {
  
  var settingsSchema = mongoose.Schema({
    min_amount: Number,
    max_amount: Number,
    stripe_token: String,
    commission: String,
    offerlimit: Number,
    tax_array: Array
  });
  
  return mongoose.model('yeepi-settings', settingsSchema);
};

module.exports = new settingsModel();

