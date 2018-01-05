var Settings = require('../persister/settings');
var cors = require('cors');

module.exports = function(app, passport){
  app.use(cors());
  
  app.post('/settings/create1', function(req, res) {
    Settings.find({}, function(err, settings) {
      if (err) {
        res.send({"result": false, "text": err});
      }
      
      settings[0].min_amount = 200;
      settings[0].max_amount = 1000;
      settings[0].stripe_token = 'ccc';
      settings[0].commission = 'commission';
      settings[0].offerlimit = 20;
      settings[0].save(function(err) {
        if (err) {
          res.send({"result":false, "text": err});
        }
        res.send({"result":true});
      });
      
    });
  });
  
  app.get('/settings/list', function(req, res) {
    Settings.find({}, function(err, settings) {
      if (err) {
        res.send({"result": false, "text": err});
      }
      
      res.send({ "result":true, "settings": settings });
    });
  });
  
  app.get('/settings/retrieveinfos', function(req, res) {
    Settings.find({}, function(err, settings) {
      if (err) {
        res.send({"result": false, "text": err});
      }
      
      res.send({ "result":true, "settings": settings[0] });
    });
  });
  
  
  app.post('/settings/addtax', function(req, res) {
    Settings.find({}, function(err, settings) {
      if (err) {
        res.send({"result": false, "text": err});
      }

      var tax_array = settings[0].tax_array;
      tax_array.push({
        province: req.param('str1'),
        tax_name: req.param('str2'),
        description: req.param('str3'),
        percentage: req.param('str4')
      });
      settings[0].tax_array = tax_array;

      settings[0].save(function(err) {
        if (err) {
          res.send({"result":false, "text": err});
        }
        res.send({"result":true});
      });
      
    });
  });
  
  app.post('/settings/removetax', function(req, res) {
    var tax_name = req.param('tax_name');
  
    Settings.find({}, function(err, settings) {
      if (err) {
        res.send({"result": false, "text": err});
      }
      var arr = [];
      for (var i = 0; i < settings[0].tax_array.length; i++) {
        if (settings[0].tax_array[i].tax_name !== tax_name) {
          arr.push(settings[0].tax_array[i]);
        }
      }
      settings[0].tax_array = arr;
      settings[0].save(function(err) {
        if (err) {
          res.send({"result":false, "text": err});
        }
        res.send({"result":true});
      });
    
    });
    
    
  });
  
  
  
  app.post('/settings/update4', function(req, res) {
    Settings.find({}, function(err, settings) {
      if (err) {
        res.send({"result": false, "text": err});
      }
      settings[0].min_amount = req.param('str1');
      settings[0].max_amount = req.param('str2');
      settings[0].commission = req.param('str3');
      settings[0].stripe_token = req.param('str4');
      settings[0].offerlimit = req.param('str5');
      settings[0].save(function(err) {
        if (err) {
          res.send({"result":false, "text": err});
        }
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
