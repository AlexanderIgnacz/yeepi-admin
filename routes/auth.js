var Users = require('../persister/user');
var global = require('../persister/global');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, passport){
	app.get('/user/list',isAuthenticated, function(req, res) {
		 Users.find({}, 
	      function(err, users) {
	        // In case of any error, return using the done method
	        if (err)
	          return done(err);
	        // Username does not exist, log error & redirect back
	        res.send(users);
	      }
	    );
	});

	app.get('/user/list/count',isAuthenticated, function(req, res) {
		 Users.find({}, 
	      function(err, users) {
	        // In case of any error, return using the done method
	        if (err)
	          return done(err);
	        // Username does not exist, log error & redirect back
	        console.info('users', users.length);
	        res.send({count: users.length});
	      }
	    );
	});

	app.post('/user/delete',isAuthenticated, function(req, res) {
		var id = req.param('id');
		Users.findByIdAndRemove(id,function(err){
			if (err){
			  console.log('Error in Saving users: '+err);  
			  res.send({"result":false});
			}
			res.send({"result":true});
		})
	});

	app.post('/user/update',isAuthenticated, function(req, res) {
		var id = req.param('current_userid');
		Users.findById(id,function(err, user){
			if (err){
			  console.log('Error in Saving users: '+err);  
			  res.send({"result":"error"});
			}
			user.username = req.param('update_username');
			user.password = createHash(req.param('update_pass'));
			user.admintype = req.param('update_admintype');
			user.save(function(){
				res.send({"result":true});
			})
		})
	});

	app.post('/user/createnew',isAuthenticated, function(req, res) {
		var newUser = new Users();
		// set the user's local credentials
		newUser.username = req.param('username');
		newUser.password = createHash(req.param('password'));
		newUser.email = req.param('email');
		newUser.admintype = req.param('admintype');
		newUser.registeredOn = getRegisteredOn();
		// newUser.gender = "";
		// newUser.address = "";
		// newUser.signupIp = "";
		// newUser.registeredOn = "";

		// save the user
		newUser.save(function(err) {
			if (err) {
			  console.log('Error in Saving users: '+err);  
			  res.send({"result":false, "err": err});
			} else {
				res.send({"result":true});
			}
		});	
	});

	app.get('/username', function(req, res) {
		res.send({"username":global.username});
	})
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

