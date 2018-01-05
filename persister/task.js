var mongoose = require('mongoose');
var moment = require('moment');

var taskModel = function () {
  
  var taskSchema = mongoose.Schema({
    token: String,
    user_token: String,
    user_avatar: String,
    user_postername: String,
    task_category: 0,
    task_title: String,
    task_description: String,
    task_type: 0,
    task_location: String,
    task_location_city: String,
    task_location_lat: 0,
    task_location_lng: 0,
    task_budget: 0,
    task_numberoftasker: 0,
    task_attachments: Array,
    task_deadline: String,
    task_postline: String,
    task_updateline: String,
  
    task_from_location: String,
    task_from_location_zip: String,
    task_from_location_lat: Number,
    task_from_location_lng: Number,
  
    task_to_location: String,
    task_to_location_zip: String,
    task_to_location_lat: Number,
    task_to_location_lng: Number,
  
    task_status: Number,
    task_state: Number,
    offercount: Number,
  
    assigned_amount: String,
    assigned_user_token: String,
    
    task_start: Boolean,
  
    task_is_endleasing: Boolean,
    task_house_or_apartment: Boolean,
    task_cleaning_option1: Boolean,
    task_cleaning_option2: Boolean,
    task_cleaning_option3: Boolean,
    task_cleaning_option4: Boolean,
    task_cleaning_option5: Boolean,
    task_bedroomcount: Number,
    task_bathroomcount: Number,
    
    offerarray: Array
    
  });
  
  return mongoose.model('task', taskSchema);
};

module.exports = new taskModel();

