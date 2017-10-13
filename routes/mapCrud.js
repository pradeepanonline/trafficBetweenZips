var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('ds031632.mongolab.com', 31632, {auto_reconnect: true});

//db = new Db('maps', server);
var db = new Db('heroku_app36283253', server);


db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'maps' database");
        db.authenticate('heroku_app36283253', 'llm46nefmbrue5kp61l2u2a8q7', function(err, result) {
            if(err) {
                console.log("Failed to authenticate !");
                process.exit();
            }
            db.collection('maps', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'maps' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
        });
    }
});

exports.sayHi = function() {
	console.log("Hi");
}

exports.addMap = function(map) {
    console.log('Adding entry: ' + JSON.stringify(map));
    db.collection('maps', function(err, collection) {
        collection.insert(map, {safe:true}, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('Success: ' + JSON.stringify(result));
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
var populateDB = function() {

 var map = [
 {
     origin: "94086",
     destn: "94539",
     duration_in_traffic : 1000,
     timestamp : new Date()
 }];

 db.collection('maps', function(err, collection) {
     collection.insert(map, {safe:true}, function(err, result) {});
 });

};
