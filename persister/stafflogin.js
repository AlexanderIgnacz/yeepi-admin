var mongoose = require('mongoose');

var staffloginModel = function () {

  var staffloginSchema = mongoose.Schema({
    username: String,
    email: String,
    signupIp: String,
    admintype: String,
    registeredOn: String,
    loggedOn: String
  });

  return mongoose.model('staff-login', staffloginSchema);
};

module.exports = new staffloginModel();