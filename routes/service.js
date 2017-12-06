var Services = require('../persister/service');
var cors = require('cors');

module.exports = function(app, passport){
  
  app.use(cors());
  
  app.post('/services/create', function(req, res) {
    var services = new Services();
    
    Services.find({ 'service' : req.param('service') },
      function(err, users) {
        if (err) {
          res.send({"result": false, "text": err});
        }
        if (users.length === 0) {
          services.service = req.param('service');
          services.status = req.param('status');
          services.preview_img = req.param('preview_img');
          services.save(function(err) {
            if (err) {
              res.send({"result":false, "text": err});
            }
            res.send({"result":true, "trans_info": services});
          });
        } else {
          res.send({"result": false, "text": "This language is already existing."});
        }
      });
    
  });
  
  app.get('/services/list',isAuthenticated, function(req, res) {
    Services.find({},
      function(err, services) {
        if (err)
          return done(err);
        res.send(services);
      }
    );
  });
  
  app.post('/frontend/services/list', function(req, res) {
    Services.find({},
      function(err, services) {
        if (err) {
          res.send({ "result": false });
        }
        res.send({ "result": true, "services": services });
      }
    );
  });
  
  
  app.post('/services/remove', isAuthenticated, function(req, res) {
    Services.findByIdAndRemove(req.param('id'), function(err){
      if (err){
        res.send({"result":false, "text": err});
      }
      res.send({"result":true});
    });
  });
  
  app.post('/services/update', function(req, res) {
    Services.findById(req.param('id'), function (err, services) {
      if (err) {
        res.send({"result": false, "text": err});
      }
      services.service = req.param('service');
      services.status = req.param('status');
      services.preview_img = req.param('preview_img');
      services.save(function (err) {
        res.send({"result": true});
      });
    });
  });
};


var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};
