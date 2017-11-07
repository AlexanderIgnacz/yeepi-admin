var LocalStrategy = require('passport-local').Strategy;
var User = require('../persister/user');
var Stafflogin = require('../persister/stafflogin');
var bcrypt = require('bcrypt-nodejs');
var global = require('../persister/global');

module.exports = function(passport){
	passport.use('login', new LocalStrategy({
	    passReqToCallback : true
	  },
	  function(req, username, password, done) { 
	    
	    // check in mongo if a user with username exists or not
	    User.findOne({ 'username' :  username }, 
	      function(err, user) {
	        // In case of any error, return using the done method
	        if (err)
	          return done(err);
	        // Username does not exist, log error & redirect back
	        if (!user){
	          console.log('User Not Found with username '+username);
	          return done(null, false, 
	                req.flash('message', 'User Not found.'));                 
	        }
	        // User exists but wrong password, log the error 
	        if (!isValidPassword(user, password)){
	          console.log('Invalid Password');
	          return done(null, false, 
	              req.flash('message', 'Invalid Password'));
	        }
	        // User and password both match, return user from 
	        // done method which will be treated like success
	        global.username = username;

	        var newStaffLogin = new Stafflogin();
	        newStaffLogin.username = user.username;
	        newStaffLogin.email = user.email;
	        newStaffLogin.signupIp = user.signupIp;
	        newStaffLogin.admintype = user.admintype;
	        newStaffLogin.registeredOn = user.registeredOn;

			newStaffLogin.save(function(err) {
	            if (err){
	              throw err;  
	            }
		        return done(null, user);
			});
	      }
	    );
	}));

	passport.use('signup', new LocalStrategy({
	    passReqToCallback : true
	  },
	  function(req, username, password, done) {
	  	
	    findOrCreateUser = function(){
	      // find a user in Mongo with provided username
	      User.findOne({'username':username},function(err, user) {
	        // In case of any error return
	        if (err){
	          console.log('Error in SignUp: '+err);
	          return done(err);
	        }
	        // already exists
	        if (user) {
	          console.log('User already exists');
	          return done(null, false, 
	             req.flash('message','User Already Exists'));
	        } else {
	          // if there is no user with that email
	          // create the user
	          var newUser = new User();
	          // set the user's local credentials
	          newUser.username = username;
	          newUser.password = createHash(password);
	          newUser.weakpassword = password;
	          newUser.email = req.param('email');
	          newUser.firstName = req.param('firstName');
	          newUser.lastName = req.param('lastName');
	          newUser.admintype = req.param('admintype');;
          	  newUser.signupIp = global.public_ip;
	          newUser.registeredOn = getRegisteredOn();
	 
	          // save the user
	          newUser.save(function(err) {
	            if (err){
	              console.log('Error in Saving user: '+err);  
	              throw err;  
	            }
	            console.log('User Registration succesful');    
	            return done(null, newUser);
	          });
	        }
	      });
	    };
	     
	    // Delay the execution of findOrCreateUser and execute 
	    // the method in the next tick of the event loop
	    process.nextTick(findOrCreateUser);
	  }));
	
	passport.serializeUser(function(user, done) {
	  done(null, user._id);
	});
	 
	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});
}	

var getRegisteredOn = function() {
    var datetime = new Date();
	return datetime.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

var isValidPassword = function(user, password){
  return bcrypt.compareSync(password, user.password);
}


// Generates hash using bCrypt
var createHash = function(password){
 return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
