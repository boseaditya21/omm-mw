import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import sfCalls from './sfCalls';
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens


export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	// test Request
	api.get('/loginSF', (req, res) => {
		console.log('Before Login');
		var promise = sfCalls.login().then(function (str) {
			res.end(str);
		},
		function (str) {
			res.end(str);
		});
		
	});

	api.post('/authenticate', function(req, res) {

		var user = { 
		name: 'Nick', 
		password: 'password',
		admin: true 
	};

	if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, config.secret, {
					expiresIn: 10800 // expires in 3 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}		

		}
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
api.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------



	api.get('/test', (req, res) => {
		console.log('After Call');
		res.end("Working Alright");

	});

	api.get('/select', (req, res) => {
		console.log('Before Select');
		
		var promise = sfCalls.selectQuery().then(function (str) {
			res.end(str);
		},
		function (str) {
			res.end(str);
		});

	});

	return api;
}
