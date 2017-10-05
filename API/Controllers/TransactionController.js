'use strict';

var mongoose = require('mongoose');
var Transaction = require('../Models/transaction');
var User = mongoose.model('User');
var shortid = require('shortid');

exports.addABill = function(req,res)
{
  console.log(req.body);
  var transactionId = shortid.generate();
  console.log(transactionId);
  var userNumber = req.body.userNumber;
  var friendNumber = req.body.friendNumber;
  var friendName = req.body.friendName;
  var amount  = req.body.amount;

  var TransactionSchema = Transaction.TransactionSchema;
  var transaction = new TransactionSchema();
  transaction.amount = amount;
  transaction.transactionId = transactionId;
  transaction.description = req.body.description;
  console.log(transaction);


  User.findOne({mobileNumber:friendNumber}, function(err,isUserFriend)
  {
	if(err)	return err;
	console.log('user ',isUserFriend);
	
	User.update({mobileNumber:userNumber,"friends.friendNumber" : friendNumber},
		    {"$push":{"friends.$.transactions":transaction}},
		    { "new": true, "upsert": true },
		    function(err,data)
	{
		if(err)	return err;
		console.log(data);
		console.log(friendNumber);
		User.update({mobileNumber:friendNumber,"friends.friendNumber" : userNumber},
			    {"$push":{"friends.$.transactions":transaction}},
			    { "new": true, "upsert": true },
			    function(err,data)
			{
				if(err)	return err;
				console.log('user updated');
			});
	});
  });
};
