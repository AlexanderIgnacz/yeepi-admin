var mongoose = require('mongoose');

var taskModel = function () {
  
  var taskSchema = mongoose.Schema({
    token: String,
    user_token: String,
    task_category: 0,
    task_title: String,
    task_description: String,
    task_type: 0,
    task_location: String,
    task_location_lat: 0,
    task_location_lng: 0,
    task_start_daydelta: 0,
    task_deadline_delta: 0,
    task_budget: 0,
    task_numberoftasker: 0,
    task_attachments: Array
  });
  
  return mongoose.model('task', taskSchema);
};

module.exports = new taskModel();

