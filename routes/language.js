var Langs = require('../persister/language');
var cors = require('cors');

module.exports = function(app, passport){
  
  app.use(cors());
  
  app.post('/langs/create', function(req, res) {
    var langs = new Langs();
    
    Langs.find({ 'lang' : req.param('lang') },
      function(err, users) {
        if (err) {
          res.send({"result": false, "text": err});
        }
        if (users.length === 0) {
          langs.lang = req.param('lang');
          langs.status = req.param('status');
          langs.preview_img = req.param('preview_img');
          langs.save(function(err) {
            if (err) {
              res.send({"result":false, "text": err});
            }
            res.send({"result":true, "trans_info": langs});
          });
        } else {
          res.send({"result": false, "text": "This language is already existing."});
        }
      });
    
  });
  
  app.get('/langs/list',isAuthenticated, function(req, res) {
    Langs.find({},
      function(err, langs) {
        if (err)
          return done(err);
        res.send(langs);
      }
    );
  });
  
  app.post('/frontend/langs/list', function(req, res) {
    Langs.find({},
      function(err, langs) {
        if (err) {
          res.send({ "result": false });
        }
        res.send({ "result": true, "langs": langs });
      }
    );
  });
  
  app.post('/langs/remove', isAuthenticated, function(req, res) {
    Langs.findByIdAndRemove(req.param('id'), function(err){
      if (err){
        res.send({"result":false, "text": err});
      }
      res.send({"result":true});
    });
  });
  
  app.post('/langs/update', function(req, res) {
    Langs.findById(req.param('id'), function(err, langs){
      if (err) {
        res.send({"result": false, "text": err});
      }
      langs.lang = req.param('lang');
      langs.status = req.param('status');
      langs.preview_img = req.param('preview_img');
      langs.save(function(err) {
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
