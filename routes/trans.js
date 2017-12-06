var Trans = require('../persister/transportation');
var cors = require('cors');

module.exports = function(app, passport){
  
  app.use(cors());
  
  app.post('/trans/create', function(req, res) {
    var trans = new Trans();
  
    Trans.find({ 'vehiclename' : req.param('vehiclename') },
      function(err, users) {
        if (err) {
          res.send({"result": false, "text": err});
        }
        if (users.length === 0) {
          trans.vehiclename = req.param('vehiclename');
          trans.status = req.param('status');
          trans.preview_img = req.param('preview_img');
          trans.save(function(err) {
            if (err) {
              res.send({"result":false, "text": err});
            }
            res.send({"result":true, "trans_info": trans});
          });
        } else {
          res.send({"result": false, "text": "This Vehicle Name is already existing."});
        }
      });
    
  });
  
  app.get('/trans/list',isAuthenticated, function(req, res) {
    Trans.find({},
      function(err, trans) {
        if (err)
          return done(err);
        res.send(trans);
      }
    );
  });
  
  app.post('/frontend/trans/list', function(req, res) {
    Trans.find({},
      function(err, trans) {
        if (err) {
          res.send({ "result": false });
        }
        res.send({ "result": true, "trans": trans });
      }
    );
  });
  
  app.post('/trans/remove', isAuthenticated, function(req, res) {
    Trans.findByIdAndRemove(req.param('id'), function(err){
      if (err){
        res.send({"result":false, "text": err});
      }
      res.send({"result":true});
    });
  });
  
  app.post('/trans/update', function(req, res) {
    Trans.findById(req.param('id'), function(err, trans){
      if (err) {
        res.send({"result": false, "text": err});
      }
      trans.vehiclename = req.param('vehiclename');
      trans.status = req.param('status');
      trans.preview_img = req.param('preview_img');
      trans.save(function(err) {
        res.send({"result":true});
      });
    });
  });
};


var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};
