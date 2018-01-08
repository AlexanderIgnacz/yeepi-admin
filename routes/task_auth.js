var Task = require('../persister/task');
var FrontEndUser = require('../persister/frontenduser');
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
    task.user_avatar = req.param('user_avatar');
    task.user_postername = req.param('user_postername');
    task.user_posteremail = req.param('user_posteremail');
    task.task_category = req.param('task_category');
    task.task_title = req.param('task_title');
    task.task_description = req.param('task_description');
    task.task_type = req.param('task_type');
    task.task_location = req.param('task_location');
    task.task_location_city = req.param('task_location_city');
    task.task_location_lat = req.param('task_location_lat');
    task.task_location_lng = req.param('task_location_lng');
    task.task_budget = req.param('task_budget');
    task.task_numberoftasker = req.param('task_numberoftasker');
    task.task_attachments = req.param('task_attachments');
    task.task_deadline = req.param('task_deadline');
    task.task_postline = req.param('task_postline');
    task.task_updateline = req.param('task_updateline');
  
    task.task_is_endleasing = req.param('task_is_endleasing');
    task.task_house_or_apartment = req.param('task_house_or_apartment');
    task.task_cleaning_option1 = req.param('task_cleaning_option1');
    task.task_cleaning_option2 = req.param('task_cleaning_option2');
    task.task_cleaning_option3 = req.param('task_cleaning_option3');
    task.task_cleaning_option4 = req.param('task_cleaning_option4');
    task.task_cleaning_option5 = req.param('task_cleaning_option5');
    task.task_bedroomcount = req.param('task_bedroomcount');
    task.task_bathroomcount = req.param('task_bathroomcount');
    
    task.assigned_amount = '';
    task.assigned_user_token = '';
    task.task_start = false;
  
    task.task_from_location = req.param('task_from_location');
    task.task_from_location_zip = req.param('task_from_location_zip');
    task.task_from_location_lat = req.param('task_from_location_lat');
    task.task_from_location_lng = req.param('task_from_location_lng');
    
    task.task_to_location = req.param('task_to_location');
    task.task_to_location_zip = req.param('task_to_location_zip');
    task.task_to_location_lat = req.param('task_to_location_lat');
    task.task_to_location_lng = req.param('task_to_location_lng');
  
    task.task_status = req.param('task_status');
    task.task_state = req.param('task_state');
    task.offercount = 0;
    
    task.offerarray = [];
    
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
      task.task_location_city = req.param('task_location_city');
      task.task_location_lat = req.param('task_location_lat');
      task.task_location_lng = req.param('task_location_lng');
      task.task_budget = req.param('task_budget');
      task.task_numberoftasker = req.param('task_numberoftasker');
      task.task_attachments = req.param('task_attachments');
      task.task_deadline = req.param('task_deadline');
      task.task_updateline = req.param('task_updateline');
  
      task.task_is_endleasing = req.param('task_is_endleasing');
      task.task_house_or_apartment = req.param('task_house_or_apartment');
      task.task_cleaning_option1 = req.param('task_cleaning_option1');
      task.task_cleaning_option2 = req.param('task_cleaning_option2');
      task.task_cleaning_option3 = req.param('task_cleaning_option3');
      task.task_cleaning_option4 = req.param('task_cleaning_option4');
      task.task_cleaning_option5 = req.param('task_cleaning_option5');
      task.task_bedroomcount = req.param('task_bedroomcount');
      task.task_bathroomcount = req.param('task_bathroomcount');
  
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
  
  app.post('/tasks/fetchtasks', function(req, res) {
    Task.find({}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      var arr = [];
      for (var i = 0; i < users.length; i++) {
        if (users[i].task_state !== 4) {
          arr.push(users[i]);
        }
      }
      res.send({"result":true, "tasks_datas":arr});
    });
  });
  
  app.get('/frontend/tasks/list', isAuthenticated, function(req, res) {
    Task.find({},
      function(err, list) {
        if (err)
          return done(err);
        res.send(list);
      }
    );
  });
  
  app.post('/frontend/tasks/detailid/set',isAuthenticated, function(req, res) {
    global.detailtaskid = req.param('id');
    res.send({"result": true});
  });
  
  app.get('/frontend/tasks/detail',isAuthenticated, function(req, res) {
    res.render('template/frontend/tasksdetails', {});
  });
  
  app.get('/frontend/tasks/detailid/get',isAuthenticated, function(req, res) {
    res.send(global.detailtaskid);
  });
  
  app.post('/frontend/tasks/detailbyid/gets',isAuthenticated, function(req, res) {
    var id = req.param('id');
    Task.findById(id,function(err, user){
      if (err){
        res.send({"result":"error"});
      }
      res.send({"result": user});
    })
  });
  
  app.post('/frontend/tasks/offer/make', function(req, res) {
    var id = req.param('id');
    Task.findById(id,function(err, user) {
      if (err){
        res.send({"result":"error"});
      }
      var offerarray = user.offerarray;
      offerarray.push({
        user_token: req.param('user_token'),
        offer_desc: req.param('offer_desc'),
        offer_amount: req.param('offer_amount'),
        offer_update_time: req.param('offer_update_time')
      });
      user.offerarray = offerarray;

      user.save(function(err) {
        if (err) {
          res.send({"result":false, "text": err});
        }
        res.send({"result":true, "task": user });
      });
    })
  });
  
  app.post('/frontend/tasks/offer/update', function(req, res) {
    var id = req.param('id');
    Task.findById(id,function(err, user) {
      if (err){
        res.send({"result":"error"});
      }
  
      var arr = [];
      for (var i = 0; i < user.offerarray.length; i++) {
        if (user.offerarray[i].user_token !== req.param('user_token')) {
          arr.push(user.offerarray[i]);
        }
      }
      arr.push({
        user_token: req.param('user_token'),
        offer_desc: req.param('offer_desc'),
        offer_amount: req.param('offer_amount'),
        offer_update_time: req.param('offer_update_time')
      });
      user.offerarray = arr;
      
      user.save(function(err) {
        if (err) {
          res.send({"result":false, "text": err});
        }
        res.send({ "result":true, "task": user });
      });
    })
  });
  
  app.post('/tasks/fetchtasks/filterbypost', function(req, res) {
    Task.find({user_token: req.param('user_token')}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      var arr = [];
      for (var i = 0; i < users.length; i++) {
        if (users[i].task_state === 1) {
          arr.push(users[i]);
        }
      }
      res.send({"result":true, "tasks_datas":arr});
    });
  });
  
  app.post('/tasks/fetchtasks/filterbyassigned', function(req, res) {
    Task.find({user_token: req.param('user_token')}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      var arr = [];
      for (var i = 0; i < users.length; i++) {
        if (users[i].task_state === 2) {
          arr.push(users[i]);
        }
      }
      res.send({"result":true, "tasks_datas":arr});
    });
  });
  
  app.post('/tasks/fetchtasks/filterbycancelled', function(req, res) {
    Task.find({user_token: req.param('user_token')}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      var arr = [];
      for (var i = 0; i < users.length; i++) {
        if (users[i].task_state === 4) {
          arr.push(users[i]);
        }
      }
      res.send({"result":true, "tasks_datas":arr});
    });
  });
  
  app.post('/tasks/fetchtasks/filterbycompleted', function(req, res) {
    Task.find({user_token: req.param('user_token')}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      var arr = [];
      for (var i = 0; i < users.length; i++) {
        if (users[i].task_state === 3) {
          arr.push(users[i]);
        }
      }
      res.send({"result":true, "tasks_datas":arr});
    });
  });
  
  app.post('/tasks/fetchtasks/filterbyoffer', function(req, res) {
    Task.find({}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      var arr = [];
      for (var i = 0; i < users.length; i++) {
        for (var j = 0; j < users[i].offerarray.length; j++) {
          if (users[i].offerarray[j].user_token === req.param('user_token')) {
            arr.push(users[i]);
          }
        }
      }
      res.send({"result":true, "tasks_datas":arr});
    });
  });
  
  app.post('/frontend/fetchtaskbyid', function(req, res) {
    var id = req.param('id');
    Task.findById(id,function(err, user){
      if (err){
        res.send({"result": false, "text": err});
      }
      
      var offer_array = user.offerarray;
      var user_list = [];
      for (var i = 0; i < offer_array.length; i++) {
        user_list.push({ token: offer_array[i].user_token })
      }
  
      FrontEndUser.find({ $or : user_list }, function(err, response) {
        if (response === undefined) {
          res.send({ "result": true, "task": user, "offer_users": [], "assigned_user": [] });
        } else {
          if (user.task_state === 2) {
            FrontEndUser.find({ token : user.assigned_user_token }, function(err, resp) {
              res.send({ "result": true, "task": user, "offer_users": response, "assigned_user": resp[0] });
            });
          } else {
            res.send({ "result": true, "task": user, "offer_users": response, "assigned_user": [] });
          }
        }
      });
      
    })
  });
  
  app.post('/frontend/task/start', function(req, res) {
    var id = req.param('id');
    Task.findById(id,function(err, user){
      if (err){
        res.send({"result": false, "text": err});
      }
      
      user.task_start = true;
      
      user.save(function(err) {
        if (err) {
          console.info(err);
        }
        res.send({ "result":true, "task": user });
      });
      
    })
  });
  
  app.post('/frontend/task/assign', function(req, res) {
    var id = req.param('id');
    Task.findById(id,function(err, user){
      if (err){
        res.send({"result": false, "text": err});
      }
      
      user.task_state = 2;
      user.assigned_amount = req.param('offer_amount');
      user.assigned_user_token = req.param('offer_user_token');
  
  
      user.save(function(err) {
        if (err) {
          console.info(err);
        }
        FrontEndUser.find({ token : req.param('offer_user_token') }, function(err, response) {
          if (response === undefined) {
            res.send({ "result":true, "task": user, assigned_user: [] });
          } else {
            res.send({ "result":true, "task": user, assigned_user: response[0] });
          }
        });
      });
      
    })
  });
  
  app.post('/frontend/task/withdraw', function(req, res) {
    var id = req.param('id');
    Task.findById(id,function(err, user){
      if (err){
        res.send({"result": false, "text": err});
      }
      
      user.task_state = 1;
      
      user.save(function(err) {
        if (err) {
          console.info(err);
        }
        res.send({ "result":true, "task": user });
      });
      
    })
  });
  
  app.post('/frontend/task/cancel', function(req, res) {
    var id = req.param('id');
    Task.findById(id,function(err, user){
      if (err){
        res.send({"result": false, "text": err});
      }
      
      user.task_state = 4;
      
      user.save(function(err) {
        if (err) {
          console.info(err);
        }
        res.send({ "result":true });
      });
      
    })
  });
  
};

var stringGen = function(len) {
  var text = " ";
  var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+";
  for( var i=0; i < len; i++ )
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  
  return text;
};

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  
  res.redirect('/login');
};


