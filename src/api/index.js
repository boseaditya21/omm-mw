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
		console.log('Before Version');
		
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
	api.post('/register',(req,res)=>{
	console.log('Before insertion');
	//console.log(req);
		if(req && req.body){
			
			var promise = sfCalls.newUser(req.body.lastname,req.body.firstname,req.body.middlename,
				req.body.email,req.body.phone,req.body.password,
				req.body.confirmpassword,req.body.securityQues,
				req.body.securityAns).then(function (data) {
			 
			console.log(res.json);

				res.json({
					success: true,
					message: data
				});
			}
			,

		function (str) {
			res.json({ success: false, message: 'ERROR..' });
		});
		}
});

	api.post('/authenticate', function(req, res) {

	
	console.log('Before User Login');
	console.log(req);
		if(req && req.body && req.body.email && req.body.password){
			var promise = sfCalls.loginUser(req.body.email).then(function (pass) {
			console.log(pass);
			// check if password matches
			if (pass != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(req.body, config.secret, {
					expiresIn: 10800 // expires in 3 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
			
		},
		function (str) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		});
		}else{

			res.json({ success: false, message: 'Username & password is required to login' });
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


/*

"lastname":"Maharana",
"firstname":"Priyanka",
"middlename": ""
"email":"priya@gmail.com",
"phone":"893735553"
"password":"cse",
"confirmpassword":"cse",
"securityQues":"Capital of India?",
"securityAns":"Delhi"

*/