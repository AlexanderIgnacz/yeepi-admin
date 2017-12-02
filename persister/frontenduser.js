var mongoose = require('mongoose');

var feUserModel = function () {

  var feuserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    usertype: String,
    userstatus: String,
    registeredOn: String,
    profilecomplete: String,
    isverified: String,
    availablelanguage: Array,
    language: String,
    transportation: [],
    skill: Array,
    aboutme: String,
    pictureUrl: String,
    address: String,
    signupIp: String,
    phonenumber: String,
    policecheck: Boolean,
    rbqLicenceNumber: String,
    taxIds: String,
    stripeaccount: String,
    ifStripeActive: String,
    verificationType: String,
    documentType: String,
    usercategory: String,
    numberofJob: Number,
    numberofComplete: Number,
    numberofRating: Number,
    numberofReviews: Number,
    rating: Number,
    loginHistory: String,
    signupStep: Number,
    token: String,
    emailverified: Boolean,
    phoneverified: Boolean,
    fbverified: Boolean,
    bankname: String,
    imagePreviewUrl: String,
    portfolio: Array,
  
    institution: String,
    bankaddr: String,
    transit: String,
    city: String,
    postalcode: String,
    lat: Number,
    lng: Number,
    accountnumber: String,
    birth: String,
    insurance: String,
    businessname: String,
    gstTax: String,
    pstTax: String,
    
    min_amount: Number,
    max_amount: Number,
  
    fb_id: String,
    fb_email: String,
    fb_name: String,
    fb_accessToken: String
    
});

  return mongoose.model('frontend-user', feuserSchema);
};

module.exports = new feUserModel();

