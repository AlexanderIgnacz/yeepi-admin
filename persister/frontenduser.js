var mongoose = require('mongoose');

var feUserModel = function () {

  var feuserSchema = mongoose.Schema({
    username: String,
    email: String,
    usertype: String,
    userstatus: String,
    registeredOn: String,
    profilecomplete: String,
    isverified: String,

    aboutme: String,
    pictureUrl: String,
    address: String,
    signupIp: String,
    postalcode: String,
    phonenumber: String,
    policecheck: String,
    rbqLicenceNumber: String,
    taxIds: String,
    stripeaccount: String,
    ifStripeActive: String,
    verificationType: String,
    documentType: String,
    usercategory: String,
    numberofJob: String,
    numberofComplete: String,
    numberofRating: String,
    numberofReviews: String,
    rating: String,
    loginHistory: String
  });

  return mongoose.model('frontend-user', feuserSchema);
};

module.exports = new feUserModel();

