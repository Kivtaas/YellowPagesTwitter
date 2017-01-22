var tweeter = require('twitter'),
	twitter = new tweeter({
		consumer_key: "V8WKpMKxPE1BDa6M6yqYmhNjX",
		consumer_secret: "3vjIB7QD79mQQ8cyjG9iiHveSOwuANGBzRIKyWS0HWLkh8oZW6",
		access_token_key: "822837700294217734-V0JmPkYE2sQt4l8tB9nCARqYM3Vij0i",
		access_token_secret: "dLuBxTiklftYocbf0c5wR7T1igVkl8AmPZLR4sidueVNR"
	});

var http = require("http");

var options = {
  "method": "POST",
  "hostname": "hackaton.ypcloud.io",
  "port": null,
  "path": "/search",
  "headers": {
    "content-type": "application/json",
    "cache-control": "no-cache",
    "postman-token": "31dc4a92-5cae-d44c-41e6-01d0bb2e1d5c"
  }
};
	
		util = require("util");
		tweets = [];	

	var message, screenName, location;

	twitter.stream("statuses/filter", {track: '#AskYP'}, function(stream){

			stream.on('data', function(data){

				console.log(data.user.screen_name + "\n" + data.text + "\n" + data.user.location);
				var pattern = new RegExp("#askyp", 'gi');
				
				message = data.text.replace(pattern, "");
				screenName = data.user.screen_name;
				console.log (data.user.screen_name);


				var req = http.request(options, function (res) {
				  var chunks = [];

				  res.on("data", function (chunk) {
				    chunks.push(chunk);
				  });

				  res.on("end", function () {
				    var body = Buffer.concat(chunks);
				   	var temp = JSON.parse(body.toString());
				//   	console.log(temp.searchResult[0].merchants[0]);
				try{
				  	var business1 = temp.searchResult[0].merchants[0].businessName;
				   	var street1 = temp.searchResult[0].merchants[0].address.displayLine;
				   	var business2 = temp.searchResult[0].merchants[1].businessName;
				   	var street2 = temp.searchResult[0].merchants[1].address.displayLine;
					var output;

			   		output = ('@' + screenName + ", why not try " + business1 + " at " + street1 + ", or " + business2 + " at " + street2 + "?");

				   	console.log("Output " + output);
					twitter.post('statuses/update', {status: output});
				}
				catch(err){
					console.log("\n\n---ERROR---\n\n");
				}	
				  });
				});

				req.write(JSON.stringify({ search: 
				   [ { searchType: 'PROXIMITY',
				       collection: 'MERCHANT',
				       what: message,
				       where: { type: 'GEO', value: '45.495514, -73.578926' } } ] }));
				req.end();

			});
	});


