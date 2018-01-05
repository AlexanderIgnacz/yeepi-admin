var mongoose = require('mongoose');

var messagelinkModel = function () {
  
  var messagelinkSchema = mongoose.Schema({
    poster_email: String,
    tasker_email: String
  });
  
  return mongoose.model('messagelink', messagelinkSchema);
};

module.exports = new messagelinkModel();

