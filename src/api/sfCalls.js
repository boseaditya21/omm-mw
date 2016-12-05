var host = 'https://cs18.salesforce.com/services';

var nforce = require('nforce');

var org = {};

var restClient = {
	login(){

  var promise = new Promise(function (resolve, reject) {
   org = nforce.createConnection({
    clientId: '3MVG9Se4BnchkASm4Fl2aSbVHUFyu4GPWFY_LIYJ7yHSov3yxFaEC_DclSHLLgleOLKWeQNPRu_Wbk7P76gSP',
    clientSecret: '1327991390600236222',
    redirectUri: 'http://localhost:3000/oauth/_callback',
    apiVersion: 'v27.0',  // optional, defaults to current salesforce API version
    environment: 'sandbox',  // optional, salesforce 'sandbox' or 'production', production default
    mode: 'single', // optional, 'single' or 'multi' user mode, multi default
    autoRefresh: true
  });

   org.authenticate({ username: 'admin.dev@omm.com', 
    password: 'Welcome4321YgEjegxg7NmqoXMHiZ77yQcK'}, function(err, resp){
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

				    console.log('Pass : : :  ' , acc._fields.name);

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

	,
		loginUser(userEmail){

			var promise = new Promise(function (resolve, reject) {
			
			var q = 'select  Id,Name,Email_Address__c,peer__Password__c from Account where Email_Address__c='+"'"+userEmail+"'";
			console.log(q);

				org.query({ query: q }, function(err, resp){
					console.log(err);
					console.log(resp);
				  if(!err && resp.records && resp.records.length>0) {

				    var acc = resp.records[0];
				    //console.log(acc._fields);
				    //console.log('Password : : :  ' , acc._fields.peer__password__c);

				    resolve(acc._fields.peer__password__c);
				    /*acc.set('Name', 'Really Spiffy Cleaners');
				    acc.set('Industry', 'Cleaners');

				    org.update({ sobject: acc, oauth: oauth }, function(err, resp){
				      if(!err) console.log('It worked!');
				    });*/

				  }
				  reject("Unable to Retrieve"+err);
				});



		});
		return promise;

		
	}

}
export default restClient;
