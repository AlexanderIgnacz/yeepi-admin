var Users = require('../persister/user');
var global = require('../persister/global');

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



