var FrontEndUser = require('../persister/frontenduser');
var FrontEndUserLoginHistory = require('../persister/frontenduserloginhistory');
var bodyParser = require("body-parser");
var global = require('../persister/global');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var AWS = require('aws-sdk');



AWS.config.update({accessKeyId: 'AKIAIRJXVAVFSCH7FVZA', secretAccessKey: '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', region: "us-east-1"});
var ses = new AWS.SES({apiVersion: '2010-12-01'});

module.exports = function(app, passport){
  
	app.post('/feuser/create', function(req, res) {
		var frontendUser = new FrontEndUser();
		frontendUser.username = req.param('username');
    frontendUser.email = req.param('email').toLowerCase();
    frontendUser.password = req.param('password');
		frontendUser.usertype = req.param('accounttype');
    frontendUser.phonenumber = req.param('phonenumber');
    frontendUser.address = req.param('address');
    frontendUser.availablelanguage = req.param('availablelanguage');
    frontendUser.language = req.param('language');
    frontendUser.transportation = req.param('trans');
    frontendUser.skill = req.param('skill');
    
		frontendUser.userstatus = req.param('userstatus');
		frontendUser.registeredOn = req.param('registeredOn');
		frontendUser.profilecomplete = req.param('profilecomplete');
		frontendUser.isverified = req.param('isverified');
		frontendUser.aboutme = req.param('aboutme');
		frontendUser.pictureUrl = req.param('pictureUrl');
		frontendUser.signupIp = req.param('signupIp');
		frontendUser.postalcode = req.param('zipcode');
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
		frontendUser.imagePreviewUrl = "";

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

	app.post('/user/signupverify', function(req, res) {

		// var code = stringGen(6);
    //
		// ses.sendEmail(
		// 	{
		// 		Source: 'yeepi.dev@gmail.com',
		// 		Destination: { ToAddresses: [req.param('email')] },
		// 		Message: {
		// 			Subject: {
		// 				Data: 'Signup Email Verification'
		// 			},
		// 			Body: {
		// 				Text: {
		// 					Data: code
		// 				}
		// 			}
		// 		}
		// 	}
		// 	, function(err, data) {
		// 		if(err) throw err;
		// 		console.log('Email sent:');
		// 		console.log(data);
		// 	});
		// res.send({"result": true, "code": code});
    
    var code = stringGen(6);
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yeepi.dev@gmail.com',
        pass: 'Montreal_01'
      }
    });
    
    var mailOptions = {
      from: 'yeepi.dev@gmail.com',
      to: req.param('email'),
      subject: 'Yeepi Signup Verification Code',
      text: code
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        // res.send({ "result": false, "text": error })
      } else {
        // res.send({ "result": true, "code": code })
      }
    });
    
    res.send({"result": true, "code": code})
	});
	
	app.post('/user/signup/validate/username', function (req, res) {
    FrontEndUser.find({ 'username' : req.param('username') },
      function(err, users) {
        if (err) {
          res.send({"result": "error"});
        }
        if (users.length === 0) {
          res.send({"result": true});
				} else {
          res.send({"result": false});
				}
      });
  });
  
  app.post('/user/signup/validate/email', function (req, res) {
    FrontEndUser.find({ 'email' : req.param('email').toLowerCase() },
      function(err, users) {
        if (err) {
          res.send({"result": "error"});
        }
        if (users.length === 0) {
          res.send({"result": true});
        } else {
          res.send({"result": false});
        }
      });
  });
  
	app.post('/user/signup/first', function(req, res) {
		
		var token = stringGen(80);
		
    var frontendUser = new FrontEndUser();
    frontendUser.username = req.param('username');
    frontendUser.email = req.param('email').toLowerCase();
    frontendUser.password = req.param('password');
    frontendUser.availablelanguage = req.param('availablelanguage');
    frontendUser.language = req.param('language');
    frontendUser.transportation = req.param('trans');
    frontendUser.address = req.param('address');
    frontendUser.postalcode = req.param('zipcode');
    frontendUser.lat = req.param('lat');
    frontendUser.lng = req.param('lng');
    frontendUser.phonenumber = req.param('phonenumber');
    frontendUser.usertype = req.param('accounttype');
    frontendUser.skill = req.param('skill');
    frontendUser.signupStep = 1;
    if (req.param('signupstep') == 2) {
      frontendUser.signupStep = 2;
    }
    frontendUser.existstripe = req.param('existstripe');
    frontendUser.userstatus = "Active";
    frontendUser.registeredOn = getRegisteredOn();
    frontendUser.profilecomplete = "Incompleted";
    frontendUser.isverified = "Unverfied";
    frontendUser.aboutme = "";
    frontendUser.pictureUrl = "";
    frontendUser.signupIp = req.param('signupIp');
    frontendUser.policecheck = false;
    frontendUser.rbqLicenceNumber = "";
    frontendUser.taxIds = "";
    frontendUser.stripeaccount = "";
    frontendUser.ifStripeActive = "";
    frontendUser.verificationType = "";
    frontendUser.documentType = "";
    frontendUser.usercategory = "";
    frontendUser.numberofJob = 0;
    frontendUser.numberofComplete = 0;
    frontendUser.numberofRating = 0;
    frontendUser.numberofReviews = 0;
    frontendUser.rating = 0;
    frontendUser.loginHistory = "";
    frontendUser.token = token;
    frontendUser.emailverified = true;
    frontendUser.phoneverified = false;
    frontendUser.fbverified = false;
    frontendUser.bankname = "";
    frontendUser.imagePreviewUrl = "";
    frontendUser.portfolio = [];
    
    frontendUser.institution = "";
    frontendUser.bankaddr = "";
		frontendUser.transit = "";
		frontendUser.city = "";
		frontendUser.accountnumber = "";
		frontendUser.birth = "";
		frontendUser.insurance = "";
		frontendUser.businessname = "";
		frontendUser.gstTax = "";
		frontendUser.pstTax = "";
		
		frontendUser.min_amount = 10;
		frontendUser.max_amount = 200;
    
    frontendUser.fb_id = "";
    frontendUser.fb_email = "";
    frontendUser.fb_name = "";
    frontendUser.fb_accessToken = "";
    
    
    frontendUser.save(function(err) {
      if (err) {
        console.info(err);
      }
      res.send({"result":true, "token": token, "email": req.param('email').toLowerCase(), "username": req.param('username') });
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
    var min_amount = req.param('min_amount');
    var max_amount = req.param('max_amount');
		FrontEndUser.findById(id,function(err, user){
			if (err){
			  console.log('Error in Saving users: '+err);  
			  res.send({"result":"error"});
			}
			user.userstatus = userStatus;
			user.policecheck = policecheck;
      user.min_amount = min_amount;
      user.max_amount = max_amount;
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
	
  app.post('/frontend/user/login', function(req, res) {
  	var email = req.param('email').toLowerCase();
  	var pass = req.param('pass');
    FrontEndUser.find({email: email}, function(err, users){
      if (err){
        res.send({"result":false, "text": err});
      }
      if (users.length === 0) {
      	res.send({"result": false, "text": "There is no email you entered."})
			} else {
        if (users[0].password === pass) {
  
          var history = new FrontEndUserLoginHistory();
          history.loginDate = getRegisteredOn();
          history.loginIp = req.param('loginIp');
          history.username = users[0].username;
          history.save(function(err) {
            if (err) {
              console.info(err);
            }
          });
          res.send({ "result": true, "token": users[0].token, "signupStep": users[0].signupStep, "userstatus": users[0].userstatus, "imagePreviewUrl": users[0].imagePreviewUrl, "email": email.toLowerCase(), "username": history.username })
				} else {
          res.send({"result": false, "text": "Password is incorrect, please try again."})
				}
			}
    })
  });
  
  app.post('/frontend/user/fetchpersonalinfos', function(req, res) {
    FrontEndUser.find({token: req.param('token')}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      res.send({"result":true, "personal_datas":users[0]});
    });
  });
  
  app.post('/frontend/user/updateFB', function(req, res) {
    FrontEndUser.find({token: req.param('token')}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      users[0].fb_id = req.param('fb_id');
      users[0].fb_email = req.param('fb_email');
      users[0].fb_name = req.param('fb_name');
      users[0].fb_accessToken = req.param('fb_accessToken');
      users[0].fbverified = true;
      users[0].save(function(err) {
        if (err) {
          res.send({"result":false, "text": err});
        }
        res.send({"result":true, "personal_datas":users[0]});
      });
    });
  });
  
  app.post('/frontend/user/editSave1', function(req, res) {
    FrontEndUser.find({token: req.param('token')}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      users[0].username = req.param('username');
      users[0].phonenumber = req.param('phonenumber');
      users[0].address = req.param('address');
      users[0].imagePreviewUrl = req.param('imagePreviewUrl');
      users[0].portfolio = req.param('portfolio');
  
      if (req.param('usertype') === 1) {
        users[0].usertype = "Tasker";
      } else if (req.param('usertype') === 2) {
        users[0].usertype = "Poster";
      } else {
        users[0].usertype = "Both";
      }
      if (req.param('language')) {
        users[0].language = "English";
      } else {
        users[0].language = "French";
      }
      users[0].aboutme = req.param('aboutme');
      users[0].availablelanguage = req.param('availablelanguage');
      users[0].save(function(err) {
        if (err) {
          res.send({"result":false, "text": err});
        }
        res.send({"result":true, "personal_datas":users[0]});
      });
    });
  });
  
  app.post('/frontend/user/editSave2', function(req, res) {
    FrontEndUser.find({token: req.param('token')}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      users[0].skill = req.param('skill');
      users[0].transportation = req.param('trans');
      users[0].rbqLicenceNumber = req.param('rbq');
      users[0].policecheck = req.param('policecheck');
      users[0].save(function(err) {
        if (err) {
          res.send({"result":false, "text": err});
        }
        res.send({"result":true, "personal_datas":users[0]});
      });
    });
  });
  
  app.post('/frontend/user/sendforgotcode', function(req, res) {
    FrontEndUser.find({email: req.param('email').toLowerCase()}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      if (users.length === 0) {
      	res.send({"result":false, "text": "We can't find this email."});
			} else {
        var code = stringGen(6);
  
        ses.sendEmail(
          {
            Source: 'yeepi.dev@gmail.com',
            Destination: { ToAddresses: [req.param('email')] },
            Message: {
              Subject: {
                Data: 'Forgot Password Email Verification. Please copy this code ' + code + ' and paste in yeepi.'
              },
              Body: {
                Text: {
                  Data: code
                }
              }
            }
          }
          , function(err, data) {
            if(err) throw err;
            console.log('Email sent:');
            console.log(data);
          });
        res.send({"result": true, "code": code});
			}
    });
  });
  
  
  
  app.post('/frontend/user/phoneverify', function(req, res) {
  
    const accountSid = 'ACc6a83be8c3e1c3ac7794a0feb172f356';
    const authToken = '576924e1ec783d42ff00c880cb254158';

    const client = require('twilio')(accountSid, authToken);


    var code = stringGen(6);
    client.messages
      .create({
        to: req.param('phonenumber'),
        from: '+15149003621',
        body: 'Veriication code: ' + code
      })
      .then(res.send({"result": true, "code": code}))
		
  });
  
  app.post('/frontend/user/phoneverifyinprofile', function(req, res) {
  
    FrontEndUser.find({token: req.param('token')}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      users[0].phoneverified = true;
      users[0].save(function(err) {
        if (err) {
          console.info(err);
          res.send({"result":false, "text":err});
        }
        res.send({"result":true, personal_datas: users[0]});
      });
    });
    
  });
  
  app.post('/frontend/user/sendforgotreq', function(req, res) {
    FrontEndUser.find({email: req.param('email').toLowerCase()}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      if (users.length === 0) {
        res.send({"result":false, "text": "We can't find this email."});
      } else {
        users[0].password = req.param('newpass');
        users[0].save(function(err) {
          if (err) {
            console.info(err);
          }
          res.send({"result":true});
        })
      }
    });
  });
  
  app.post('/frontend/user/updateProfile', function(req, res) {
    FrontEndUser.find({token: req.param('token')}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      users[0].bankname = req.param('_input_bankname');
      users[0].accountholdername = req.param('_input_accountholder');
      users[0].institution =  req.param('_input_institution');
      users[0].bankaddr = req.param('_input_bankaddr');
      users[0].transit = req.param('_input_transit');
      users[0].city = req.param('_input_city');
      users[0].postalcode = req.param('zipcode');
      users[0].lat = req.param('lat');
      users[0].lng = req.param('lng');
      users[0].accountnumber = req.param('_input_accountnumber');
      users[0].birth = req.param('_input_birth');
      users[0].insurance = req.param('_input_insurance');
      users[0].businessname = req.param('_input_businessname');
      users[0].gstTax = req.param('_input_gstTax');
      users[0].pstTax = req.param('_input_pstTax');
      users[0].existstripe = req.param('existstripe');
      users[0].signupStep = 2;
      users[0].save(function(err) {
        if (err) {
          console.info(err);
        }
        res.send({"result":true});
      });
    });
  });
  
  app.post('/frontend/user/updatelanguage', function(req, res) {
    FrontEndUser.find({token: req.param('token')}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      users[0].language = req.param('language');
      users[0].save(function(err) {
        if (err) {
          console.info(err);
        }
        res.send({"result":true});
      });
    });
  });
  
  app.post('/frontend/user/getlanguage', function(req, res) {
    FrontEndUser.find({token: req.param('token')}, function(err, users) {
      if (err){
        res.send({"result":false, "text": err});
      }
      res.send({"result":true, "language": users[0].language});
    });
  });
  
};

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

var createHash = function(password){
 return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

var getRegisteredOn = function() {
    var datetime = new Date();
	return datetime.toISOString().replace(/T/, ' ').replace(/\..+/, '');
};


var stringGen = function(len) {
    var text = " ";    
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+";
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
};
