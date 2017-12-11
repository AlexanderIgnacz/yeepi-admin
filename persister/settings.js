var mongoose = require('mongoose');

var settingsModel = function () {
  
  var settingsSchema = mongoose.Schema({
    min_amount: String,
    max_amount: String,
    stripe_token: String,
    commission: String,
    offerlimit: String,
    tax_array: Array
  });
  
  return mongoose.model('yeepi-settings', settingsSchema);
};

module.exports = new settingsModel();

