var mongoose = require('mongoose');

var transModel = function () {
  
  var transSchema = mongoose.Schema({
    vehiclename: String,
    status: Number,
    preview_img: String
  });
  
  return mongoose.model('transportation', transSchema);
};

module.exports = new transModel();

