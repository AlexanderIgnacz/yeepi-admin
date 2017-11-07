var StaffLogins = require('../persister/stafflogin');
var global = require('../persister/global');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, passport){
	app.get('/stafflogins/list',isAuthenticated, function(req, res) {
		StaffLogins.find({},
			function(err, histories) {
		        if (err)
					return done(err);
		        res.send(histories);
			}
	    );
	});

	app.post('/history/remove',isAuthenticated, function(req, res) {
		var id = req.param('id');
		StaffLogins.findByIdAndRemove(id,function(err){
			if (err){
			  res.send({"result":false});
			}
			res.send({"result":true});
		})
	});
}

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

var createHash = function(password){
 return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

var getRegisteredOn = function() {
    var datetime = new Date();
	return datetime.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
