var express = require('express');
var utils = require('./utils.js');

var router = express.Router();
var isExists;

/* CREATE FAKE DB */
// var currentBillId = [];
// var indexToPass = 0;

// var bills = [];

// // Each bill 
// var billMarkers = [
// 	{
// 		"currentLocation" : {"lat" : 32.3137373, "lng" : 34.8803108}
// 	},

// 	{
// 		"currentLocation" : {"lat" : 32.069221, "lng" : 34.7734675}
// 	},

// 	{
// 		"currentLocation" : {"lat" : 32.084508, "lng" : 34.8731652}
// 	}
// ];

// var arr = {
//     billId: "123",
//     billMarkers: billMarkers 
    
// }

// bills.push(arr);

/* END OF DB*/

/* NEW FAKE DB */
// var currentBillId = [];
// var indexToPass = 0;

// var fakeDB = [];

// // Each bill 
// var places = [
// 	{
// 		"name" : 'yafim',
// 		"lat" : 32.3137373,
// 		"lng" : 34.8803108
// 	},

// 	{
// 		"name" : 'gotlieb',
// 		"lat" : 32.069221, 
// 		"lng" : 34.7734675
// 	},

// 	{
// 		"name" : 'nofar',
// 		"lat" : 32.084508, 
// 		"lng" : 34.8731652
// 	}
// ];

// var arr = {
//     billID: "123",
//     places: places 
    
// }

// fakeDB.push(arr);

/* END */

// DB settings
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://rachel:wir123@ds035563.mongolab.com:35563/rachel';


// The main page
router.get('/', function(req, res){
	// load data from DB here
	res.render('index')
});


// router.get('/insertBillId', function(req, res){
// 	// load data from DB here
// 	res.render('insertBillId',{
// 		items : bills
// 	});
// });


// router.post('/add', function(req, res){

// 	//Get variables from req
// 	var lat = req.body.lat;
// 	var lng = req.body.lng;
// 	var name = req.body.name;

// 	InsertElement(lat, lng, name);

// });


// // 1. Search for bill Id (exists or not)
// // 2. redirect to checkIn with current billId 
// // 3. indexToPass - current bill index
// router.post('/billId', function(req, res){
// 	var billId = req.body.billID;
// 	var name = req.body.name;


// 	isExists = utils.SearchIdInArray(billId, fakeDB);

// 	// If no exists, Insert new billId to DB. Otherwise indexToPass = isExists
// 	if (isExists == -1){
// 		var places = [];
// 		fakeDB.push({
// 			billID: billId,
// 			places : places
// 		});
// 			indexToPass = fakeDB.length - 1;
// 	} else {
// 		indexToPass = isExists;
// 	}

// 	res.redirect('/#/insertBillId');

// });



// // Insert an element to array
// function InsertElement(lat, lng, name){
// 	var places = 
// 	{
// 		"name" : name,
// 		"lat" : lat, 
// 		"lng" : lng 
// 	};
	

// 	fakeDB[indexToPass].places.push(places);

// }

// router.get('/map/data', function(req, res){

// 	// Get parameters from url
// 	var billID = req.param('userFBId');

// 	// Search if bill exists
// 	var index = utils.findById(fakeDB, "billID", billID);

// 	if (index != null){
// 		currentBill = fakeDB[index];
// 	}
// 	else {
// 		currentBill = null;
// 	}

// 	// currentBill = (index != null) ? fakeDB[index] : null;


// 	var data = {
// 		//TODO: DELETE
// 		bills: bills,

// 		currentBill: currentBill,
		
// 		indexToPass: indexToPass,
// 		fakeDB: fakeDB
// 	};
// 	res.json(data);
// });

// router.post('/map/setCurrentBill', function(req, res){
// 	var currentBill;
// 	var billID = req.body.billIDToSearch;

// 	// Search if bill exists
// 	var index = utils.findById(fakeDB, "billID", billID);

// 	// if (index != null){
// 	// 	currentBill = fakeDB[index];
// 	// }
// 	// else {
// 	// 	currentBill = null;
// 	// }

// 	currentBill = (index != null) ? fakeDB[index] : null;


// 	var data = {
// 		currentBill: currentBill
// 	};
// 	res.json(data);

// });

router.get('/map/getUserBills', function(req, res){
	var id = req.param('userFBId');
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findBills(db, id, function(docs) {
			db.close();
			console.dir(docs);
			res.json(docs);
		});
	});
});


var findBills = function(db, id, callback) {
	// Get the documents collection
	var collection = db.collection('bills');
	// Find some documents
	collection.find({places: {$elemMatch: {fbID: id}}}).toArray(function(err, docs) {
		if (err) throw err;
		callback(docs);
	});
};

var insertBill = function(db, bID, fID, username, lati, long, callback) {
	var collection = db.collection('bills');
	collection.update({billID: bID}, {$push: { places: {name: username, fbID: fID, lng: long, lat: lati}}},
		{upsert: true }, function(err, results){
			if (err) throw err;
			console.log(results);
			callback(results);
		});
};

router.post('/map/checkIn', function(req, res){
	var billID = req.body.billID;
	var lat = req.body.lat;
	var lng = req.body.lng;
	var fbID = req.body.fbID;
	var username = req.body.name;

	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		insertBill(db, billID, fbID, username, lat, lng, function(isSuccess) {
			db.close();
			// res.render('/#/insertBillId'
			res.render(__dirname + "\\views\\partials\\checkIn" , {
				response: isSuccess
			});
		});
	});
});


// Use as module
module.exports = router;

