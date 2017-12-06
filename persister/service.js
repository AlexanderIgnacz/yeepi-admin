var mongoose = require('mongoose');

var serviceModel = function () {
  
  var serviceSchema = mongoose.Schema({
    service: String,
    status: Number,
    preview_img: String
  });
  
  return mongoose.model('service', serviceSchema);
};

module.exports = new serviceModel();

