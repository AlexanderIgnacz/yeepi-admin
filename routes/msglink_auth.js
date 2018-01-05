var MessageLinks = require('../persister/messagelink');
var FEAuth = require('../persister/frontenduser');
var Task = require('../persister/task');
var cors = require('cors');

module.exports = function(app, passport){
  app.use(cors());
  app.post('/msglink/create', function(req, res) {
    var req_poster_email = req.param('poster_email');
    var req_tasker_email = req.param('tasker_email');
    MessageLinks.find({},
      function(err, users) {
        if (err) {
          res.send({"result": false, "text": err});
        }
        var flag = false;
        for (var i = 0; i < users.length; i++) {
          if (users[i].poster_email === req_poster_email && users[i].tasker_email === req_tasker_email) {
            res.send({"result":true, "text": "already exists"});
            flag = true;
            break;
          }
          if (users[i].poster_email === req_tasker_email && users[i].tasker_email === req_poster_email) {
            res.send({"result":true, "text": "already exists"});
            flag = true;
            break;
          }
        }

        if (!flag) {
          var msglink = new MessageLinks();
          msglink.poster_email = req_poster_email;
          msglink.tasker_email = req_tasker_email;
          msglink.save(function(err) {
            if (err) {
              res.send({"result":false, "text": err});
            }
            res.send({"result":true, "link_info": msglink});
          });
        }
      });
  });
  
  app.post('/frontend/messagelinks/list', function(req, res) {
    MessageLinks.find({},
      function(err, links) {
        if (err) {
          res.send({ "result": false });
        }
        res.send({ "result": true, "messagelinks": links });
      }
    );
  });
  
  app.post('/frontend/messagelinks/fetchfilter', function(req, res) {
    MessageLinks.find({},
      function(err, users) {
        if (err) {
          res.send({"result": false, "text": err});
        }
        for (var i = 0; i < users.length; i++) {
          if (users[i].poster_email === req.param('email1') && users[i].tasker_email === req.param('email2')) {
            res.send({"result":true, "messagelinks": users[i]});
            break;
          }
          if (users[i].poster_email === req.param('email2') && users[i].tasker_email === req.param('email1')) {
            res.send({"result":true, "messagelinks": users[i]});
            break;
          }
        }
  
        // res.send({"result":true, "text": "not exists"});
      });
  });

  app.post('/frontend/messagelinks/fetchMessageLinks', function(req, res) {
    MessageLinks.find({},
      function(err, users) {
        if (err) {
          res.send({"result": false, "text": err});
        }
        var returnValue = [];
        for (var i = 0; i < users.length; i++) {
          if (users[i].poster_email === req.param('email')) {
            returnValue.push(users[i].tasker_email);
          }
          if (users[i].tasker_email === req.param('email')) {
            returnValue.push(users[i].poster_email);
          }
        }

        var returnValue1 = [];

        FEAuth.find({}, function(err1, auths) {
          if (err1) {
            res.send({"result": false, "text": err1});
          }

          for (var j = 0; j < returnValue.length; j++) {
            for (var i = 0; i < auths.length; i++) {
              if (auths[i].email === returnValue[j]) {
                returnValue1.push(auths[i].imagePreviewUrl);
                break;
              }
            }
          }

          var my_avatar = "";
          for (var k = 0; k < auths.length; k++) {
            if (auths[k].email === req.param('email')) {
              my_avatar = auths[k].imagePreviewUrl;
              break;
            }
          }

          res.send({ "result":true, "links": returnValue, "avatars": returnValue1, "my_avatar": my_avatar });
        });
      });
  });

};


var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};
