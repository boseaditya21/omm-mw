var host = 'https://cs18.salesforce.com/services';

var nforce = require('nforce');

var org = {};

var restClient = {
	login(){

		var promise = new Promise(function (resolve, reject) {
			org = nforce.createConnection({
				clientId: '3MVG9e2mBbZnmM6m2Rmtx.CJUEffIrypwYpGbRDMMw26arX74mCkqi1BS6nSF8GHI7obf3njZiIQXp8JC4uIZ',
				clientSecret: '8659610336053723674',
				redirectUri: 'http://localhost:3000/oauth/_callback',
		  apiVersion: 'v27.0',  // optional, defaults to current salesforce API version
		  environment: 'sandbox',  // optional, salesforce 'sandbox' or 'production', production default
		  mode: 'single', // optional, 'single' or 'multi' user mode, multi default
		  autoRefresh: true
		});

			org.authenticate({ username: 'Liz.Bloch@dtr.co.nz', 
				password: 'Welcome123roolnEll9A3icFRSPRJxcHLd'}, function(err, resp){
		  // the oauth object was stored in the connection object
		  if(!err){
		  	console.log('Cached Token: ' , org);
		  	resolve("Login Successful");
		  } 
		  else{
		  	reject("Unable to Login");
		  }
		});	  		


		});
		return promise;
	},
		selectQuery(){

			var promise = new Promise(function (resolve, reject) {
			
			var q = 'SELECT Id, Name FROM Account LIMIT 1';

				org.query({ query: q }, function(err, resp){

				  if(!err && resp.records) {

				    var acc = resp.records[0];

				    console.log('Name : : :  ' , acc._fields.name);

				    resolve(acc._fields.name);
				    /*acc.set('Name', 'Really Spiffy Cleaners');
				    acc.set('Industry', 'Cleaners');

				    org.update({ sobject: acc, oauth: oauth }, function(err, resp){
				      if(!err) console.log('It worked!');
				    });*/

				  }
				  reject("Unable to Retrieve");
				});



		});
		return promise;

		
	}

}
export default restClient;
