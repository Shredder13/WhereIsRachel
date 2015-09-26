var express = require('express');
var utils = require('./utils.js');
var MongoClient = require('mongodb').MongoClient;


var router = express.Router();
var isExists;

// DB settings

var assert = require('assert');
var url = 'mongodb://rachel:wir123@ds035563.mongolab.com:35563/rachel';


// The main page
router.get('/', function(req, res){
	// load data from DB here
	res.render('index')
});

// Get bill by facebook id
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

// Get bill by id
router.get('/map/getBillById', function(req, res){
	var id = req.param('billID');
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findBillByID(db, id, function(docs) {
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

var findBillByID = function(db, id, callback) {
	// Get the documents collection
	var collection = db.collection('bills');
	// Find some documents
	collection.find({billID: id}).toArray(function(err, docs) {
		if (err) throw err;
		callback(docs);
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
			if (!isSuccess) console.log('There was a problem checking in.');
			findBillByID(db, billID, function(docs) {
				db.close();
				res.json(docs);
			});
		});
	});
});


// Use as module
module.exports = router;

