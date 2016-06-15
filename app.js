var https = require("https");
var async = require('async');
var crud = require('./routes/mapCrud');
var schedule = require('node-schedule');
var config = require('config');




/* Sample URL
"https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=now&units=imperial&origins=94086&destinations=94539&key=AIzaSyBLnm_JO6x0CEythRS1zgFbY8Aq4ovcYc0";
*/

var getTime = function(url, doneCallBack) {

    var origin = "";
    var destn = "";
 	var currentTime = new Date();

    //Extract Origin & Destination from the URL
    var keyValueArray = url.split('&');
    for (var i in keyValueArray) {
        keyValue = keyValueArray[i];
        var zipValueArray = keyValue.split('=');
        for(var j in zipValueArray) {
            if(zipValueArray[j] == "origins") {
                origin = zipValueArray[++j];
                break;
            }
            if(zipValueArray[j] == "destinations") {
                destn = zipValueArray[++j];
                break;
            }
        }
    }

    console.log("[[[[Origin: " + origin + " Destination: " + destn + "]]]");

	https.get(url, function(response) {
		// data is streamed in chunks from the server
		// so we have to handle the "data" event
		var buffer = "", data, route;

		response.on("data", function(chunk) {
			buffer += chunk;
		});

		response.on("end", function(err) {
			// finished transferring data
			// dump the raw data
			//console.log(buffer);
			//console.log("\n\n\n");
			data = JSON.parse(buffer);
			// extract time
			timeInSeconds = data.rows[0].elements[0].duration_in_traffic.value;

			console.log("###########" + timeInSeconds + "############");
			var newentry = {
				origin : origin,
				destn : destn,
				duration_in_traffic : timeInSeconds,
				timestamp : currentTime
			};
			console.log(newentry);

			crud.addMap(newentry);
			return doneCallBack(null);

		});
	});

};

console.log("Program Started at time: " + new Date());

var minutes = config.get('schedule.repeat_minutes');
var apiKey = config.get('apiKey');
var center = config.get('zips.center');
console.log(center);
var points = config.get('zips.points');
console.log(points);
var allZips = points.split(',');
console.log(allZips);
var urlarray = [ ];
var staticUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=now&units=imperial&origins=";

for (var i in allZips) {
    console.log(allZips[i]);
    var fromCenter = staticUrl
    		+ center
    		+ "&destinations="
    		+ allZips[i]
    		+ "&key=" + apiKey;

    urlarray.push(fromCenter);

    var toCenter = staticUrl
            + allZips[i]
    		+ "&destinations="
    		+ center
    		+ "&key=" + apiKey;

    urlarray.push(toCenter);
}

console.log(urlarray);

var cmd = "*/" + minutes + " * * * *";
var j = schedule.scheduleJob(cmd, function(){
//invoke every 15 mins in parallel
async.each(urlarray, getTime, function(err) {
    if (err) {
        console.log("Something went wrong : " + err);
      }
     console.log("done");
     //process.exit(0);
    });

});




console.log("finished");
