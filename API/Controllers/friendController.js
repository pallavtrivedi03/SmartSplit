var mongoose = require('mongoose');
var User = mongoose.model('User');
var Friend = require('../Models/friend');
var async = require('async');

module.exports.addAFriend = function(req,res)
{
	var userNumber = req.body.userNumber;
	var friendName = req.body.friendName;
	var friendNumber = req.body.mobileNumber;	
	friend(userNumber,friendNumber,friendName, function(err,result)
	{
		if(err) return err;
		res.end("Success");
	});
};

function friend(userNumber,friendNumber,friendName,callback)
{
	console.log(userNumber,friendNumber);
	
	User.findOne({mobileNumber:friendNumber}, function(err,isUserFriend)
	{
		if(err)
		{
		 callback(err,null);
		 return;
		}

		var FriendSchema = Friend.FriendSchema;
		if(isUserFriend)
		{
		  console.log("user friend ",isUserFriend);
		  let userFriend = new FriendSchema();
		  userFriend.friendName = isUserFriend.name;
		  userFriend.friendEmail = isUserFriend.email;
	          userFriend.friendNumber = isUserFriend.mobileNumber;
	
		  var friends = isUserFriend.friends;
		  for(var i=0; i<friends.length; i++)
		  {
			var friend = friends[i];
			if(friend.friendNumber === userNumber)
			{
				console.log("Exists");
				callback(null,"Exist");
				return;
			}
		  }

		  User.update({mobileNumber:userNumber},
			      { "$push": { "friends": userFriend } },
			      { "new": true, "upsert": true },
			      function (err, user)
		 	{
			if(err)	return err;
			console.log(user);
			var friend = new FriendSchema();
			User.findOne({mobileNumber:userNumber},function(err,userData)
			{
				if(err) return err;
				friend.friendName = userData.name;
	          		friend.friendEmail = userData.email;
	                  	friend.friendNumber = userData.mobileNumber;
		          	User.update({mobileNumber:userFriend.friendNumber},{ "$push": { "friends": friend } },{ "new": true, "upsert": true },
					function (err, user)
					{
					console.log(user)
					if(err)	return err;
					callback(null,user);
					return;
			  		});
		        });
		  });
		}
		else
		{
			var userFriend = new User();
			userFriend.name = friendName;
			userFriend.mobileNumber = friendNumber;
			userFriend.isRegistered = false;
			userFriend.save(function(err,user)
			{
				if(err)	return err;
				console.log("Added Friend");
				var friend = new FriendSchema();
				friend.friendName = friendName;
				friend.friendNumber = friendNumber;
				User.update({mobileNumber:userNumber},
			      	{ "$push": { "friends": friend } },
			      	{ "new": true, "upsert": true },
			      	function (err, user)
		 		{
			 		if(err) return err;
					User.findOne({mobileNumber:userNumber},function(err,user)
					{		
						var friendUser = new FriendSchema();
						friendUser.friendName = user.name;
						friendUser.friendNumber = user.mobileNumber;
						User.update({mobileNumber:friendNumber},
			      			{ "$push": { "friends": friendUser } },
			      			{ "new": true, "upsert": true },
			      			function (err, user)
		 				{
						console.log('Added user that doesnt exists');
						callback(null,"Success");
						return;
		 				});
					});
				});
			});
		}
	});
};

module.exports.addFriend = function(userNumber,friendNumber,friendName,callback)
{
	friend(userNumber,friendNumber,friendName, function(err,result)
	{
		if(err) return err;
		callback(null,result);
	});
};
