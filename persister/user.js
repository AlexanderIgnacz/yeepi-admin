var mongoose = require('mongoose');

var userModel = function () {

  var userSchema = mongoose.Schema({
    username: String,
    password: String,
    weakpassword: String,
    email: String,
    gender: String,
    admintype: String,
    address: String,
    registeredOn: String,
    signupIp: String
  });
 

  return mongoose.model('admin-user', userSchema);
};

module.exports = new userModel();