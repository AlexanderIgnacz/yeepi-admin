var mongoose = require('mongoose');

var bbsModel = function () {

  var bbsSchema = mongoose.Schema({
    content: String,
    username: String,
    vote: Number,
    date: { type: Date, default: Date.now }
  });
 

  return mongoose.model('Bbs', bbsSchema);
};

module.exports = new bbsModel();