var FrontEndUser = require('../persister/frontenduser');
var FrontEndUserLoginHistory = require('../persister/frontenduserloginhistory');
var global = require('../persister/global');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

module.exports = function(app, passport){
	app.post('/feuser/create', function(req, res) {
		var frontendUser = new FrontEndUser();
		frontendUser.username = req.param('username');
		frontendUser.email = req.param('email');
		frontendUser.usertype = req.param('usertype');
		frontendUser.userstatus = req.param('userstatus');
		frontendUser.registeredOn = req.param('registeredOn');
		frontendUser.profilecomplete = req.param('profilecomplete');
		frontendUser.isverified = req.param('isverified');
		frontendUser.aboutme = req.param('aboutme');
		frontendUser.pictureUrl = req.param('pictureUrl');
		frontendUser.address = req.param('address');
		frontendUser.signupIp = req.param('signupIp');
		frontendUser.postalcode = req.param('postalcode');
		frontendUser.phonenumber = req.param('phonenumber');
		frontendUser.policecheck = req.param('policecheck');
		frontendUser.rbqLicenceNumber = req.param('rbqLicenceNumber');
		frontendUser.taxIds = req.param('taxIds');
		frontendUser.stripeaccount = req.param('stripeaccount');
		frontendUser.ifStripeActive = req.param('ifStripeActive');
		frontendUser.verificationType = req.param('verificationType');
		frontendUser.documentType = req.param('documentType');
		frontendUser.usercategory = req.param('usercategory');
		frontendUser.numberofJob = req.param('numberofJob');
		frontendUser.numberofComplete = req.param('numberofComplete');
		frontendUser.numberofRating = req.param('numberofRating');
		frontendUser.numberofReviews = req.param('numberofReviews');
		frontendUser.rating = req.param('rating');
		frontendUser.loginHistory = req.param('loginHistory');

		frontendUser.save(function(err) {
			if (err) {
				console.info(err);
			}
			res.send({"result":true});
		})
	});

	app.post('/frontend/user/delete',isAuthenticated, function(req, res) {
		var id = req.param('id');
		FrontEndUser.findByIdAndRemove(id,function(err){
			if (err){
			  res.send({"result":false});
			}
			res.send({"result":true});
		})
	});

	app.get('/feuser/list/count',isAuthenticated, function(req, res) {
		 FrontEndUser.find({}, 
	      function(err, users) {
	        if (err)
	          return done(err);
	        res.send({count: users.length});
	      }
	    );
	});

	app.get('/frontend/users/list', isAuthenticated, function(req, res) {
		FrontEndUser.find({},
			function(err, list) {
		        if (err)
					return done(err);
		        res.send(list);
			}
	    );
	});

	app.get('/samplemessages/get', isAuthenticated, function(req, res) {
		res.send({
			"sample1":global.sample1,
			"sample2":global.sample2,
			"sample3":global.sample3,
			"sample4":global.sample4,
			"sample5":global.sample5
		});
	});

	app.post('/user/sendmail', isAuthenticated, function(req, res) {
		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: 'tunacoder@gmail.com',
		    pass: 'Mybdayis123'
		  }
		});

		var mailOptions = {
		  from: 'tunacoder@gmail.com',
		  to: req.param('sendto'),
		  subject: req.param('subject'),
		  text: req.param('text')
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		  }
		  res.send({"result": true});
		});
	});

	app.get('/frontend/user/detail',isAuthenticated, function(req, res) {
		console.info(req);
		res.render('template/frontend/userdetail',{ message: req.flash('message') });
	});

	app.post('/frontend/user/detailid/set',isAuthenticated, function(req, res) {
		global.detailuserid = req.param('id');
		res.send({"result": true});
	});

	app.get('/frontend/user/detailid/get',isAuthenticated, function(req, res) {
		res.send(global.detailuserid);
	});

	app.post('/frontend/user/detailbyid/gets',isAuthenticated, function(req, res) {
		var id = req.param('id');
		FrontEndUser.findById(id,function(err, user){
			if (err){
			  console.log('Error in Saving users: '+err);  
			  res.send({"result":"error"});
			}
			res.send({"result": user});
		})
	});

	app.post('/frontend/user/update', isAuthenticated, function(req, res) {
		var id = req.param('id');
		var userStatus = req.param('userStatus');
		var policecheck = req.param('policecheck');
		FrontEndUser.findById(id,function(err, user){
			if (err){
			  console.log('Error in Saving users: '+err);  
			  res.send({"result":"error"});
			}
			user.userstatus = userStatus;
			user.policecheck = policecheck;
			user.save(function(err) {
				if (err) {
					res.send({"result":"error"});
				}
				res.send({"result":true});
			});
		})
	});

	app.post('/frontend/user/login/addhistory', function(req, res) {
		var history = new FrontEndUserLoginHistory();
		history.loginDate = req.param('loginDate');
		history.loginIp = req.param('loginIp');
		history.username = req.param('username');
		history.save(function(err) {
			if (err) {
				console.info(err);
			}
			res.send({"result":true});
		})
	});

	
	app.get('/frontend/user/login/gethistory', function(req, res) {
		var id = req.param('id');
		FrontEndUser.findById(id,function(err, user){
			if (err){
			  console.log('Error in Saving users: '+err);  
			  res.send({"result":"error"});
			}
			FrontEndUserLoginHistory.find({username: user.username},
				function(err, list) {
			        if (err)
						return done(err);
			        res.send(list);
				}
		    );
		})
	});

	app.post('/frontend/user/login/removehistory', function(req, res) {
		var id = req.param('id');
	    FrontEndUserLoginHistory.findByIdAndRemove(id,function(err){
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
