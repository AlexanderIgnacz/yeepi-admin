var mongoose = require('mongoose');

var langModel = function () {
  
  var langSchema = mongoose.Schema({
    lang: String,
    status: Number,
    preview_img: String
  });
  
  return mongoose.model('language', langSchema);
};

module.exports = new langModel();

