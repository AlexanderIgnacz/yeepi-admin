var global = require('../persister/global');
var bcrypt = require('bcrypt-nodejs');
var stripe = require('stripe')('sk_test_qf6xUq2PNsBMyGbkLCDnGQtN');

module.exports = function(app, passport){
	app.get('/stripe/createcustomer', function(req, res) {
		stripe.customers.create(
		  { email: 'emzo.emzo.chabo.1@gmail.com' },
		  function(err, customer) {
			res.send({"result": customer});
		  }
		);
	});

	app.get('/stripe/charge', function(req, res) {
		stripe.charges.create({
		    amount: 20000,
		    currency: 'usd',
		    customer: 'cus_BjOVQJwVKsHl6v'
		}, function(err, charge) {
		    if (err) {
		        // bad things
		        console.info('bad', err);
		    } else {
		        // successful charge
		        console.info('good');
		    }
		    res.send({"result": true})
		});
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
