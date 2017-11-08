var mongoose = require('mongoose');

var feLoginHistoryModel = function () {

  var feloginHistorySchema = mongoose.Schema({
    loginDate: String,
    loginIp: String,
    username: String
  });

  return mongoose.model('frontend-loginhistory', feloginHistorySchema);
};

module.exports = new feLoginHistoryModel();