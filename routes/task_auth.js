var Task = require('../persister/task');
var global = require('../persister/global');
var bcrypt = require('bcrypt-nodejs');
var AWS = require('aws-sdk');
var cors = require('cors');

AWS.config.update({accessKeyId: 'AKIAIRJXVAVFSCH7FVZA', secretAccessKey: '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', region: "us-east-1"});
var ses = new AWS.SES({apiVersion: '2010-12-01'});

module.exports = function(app, passport){
  
  app.use(cors());
  
  app.post('/frontend/task/create', function(req, res) {
    var token = stringGen(80);
    var task = new Task();
    
    task.token = token;
    task.user_token = req.param('user_token');
    task.task_category = req.param('task_category');
    task.task_title = req.param('task_title');
    task.task_description = req.param('task_description');
    task.task_type = req.param('task_type');
    task.task_location = req.param('task_location');
    task.task_location_lat = req.param('task_location_lat');
    task.task_location_lng = req.param('task_location_lng');
    task.task_start_daydelta = req.param('task_start_daydelta');
    task.task_deadline_delta = req.param('task_deadline_delta');
    task.task_budget = req.param('task_budget');
    task.task_numberoftasker = req.param('task_numberoftasker');
    task.task_attachments = req.param('task_attachments');
  
    task.task_from_location = req.param('task_from_location');
    task.task_from_location_zip = req.param('task_from_location_zip');
    task.task_from_location_lat = req.param('task_from_location_lat');
    task.task_from_location_lng = req.param('task_from_location_lng');
    
    task.task_to_location = req.param('task_to_location');
    task.task_to_location_zip = req.param('task_to_location_zip');
    task.task_to_location_lat = req.param('task_to_location_lat');
    task.task_to_location_lng = req.param('task_to_location_lng');
  
    
    task.save(function(err) {
      if (err) {
        console.info(err);
      }
      res.send({"result":true, "task_info": task});
    });
  });
  
  app.post('/frontend/task/remove', function(req, res) {
    var id = req.param('task_id');
    Task.findByIdAndRemove(id,function(err){
      if (err){
        res.send({"result":false, "text": err});
      }
      res.send({"result":true});
    })
  });
  
  app.post('/frontend/task/edit', function(req, res) {
    
    Task.findById(req.param('task_id'), function(err, task) {
      if (err){
        console.log('Error in Saving users: ' + err);
        res.send({"result":false, "text": err});
      }
      task.task_category = req.param('task_category');
      task.task_title = req.param('task_title');
      task.task_description = req.param('task_description');
      task.task_type = req.param('task_type');
      task.task_location = req.param('task_location');
      task.task_location_lat = req.param('task_location_lat');
      task.task_location_lng = req.param('task_location_lng');
      task.task_start_daydelta = req.param('task_start_daydelta');
      task.task_deadline_delta = req.param('task_deadline_delta');
      task.task_budget = req.param('task_budget');
      task.task_numberoftasker = req.param('task_numberoftasker');
      task.task_attachments = req.param('task_attachments');
  
      task.task_from_location = req.param('task_from_location');
      task.task_from_location_zip = req.param('task_from_location_zip');
      task.task_from_location_lat = req.param('task_from_location_lat');
      task.task_from_location_lng = req.param('task_from_location_lng');
  
      task.task_to_location = req.param('task_to_location');
      task.task_to_location_zip = req.param('task_to_location_zip');
      task.task_to_location_lat = req.param('task_to_location_lat');
      task.task_to_location_lng = req.param('task_to_location_lng');
      
      task.save(function(err) {
        if (err) {
          console.info(err);
        }
        res.send({"result":true, "task_info": task});
      });
    });
  });
  
};

var stringGen = function(len) {
  var text = " ";
  var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+";
  for( var i=0; i < len; i++ )
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  
  return text;
};
