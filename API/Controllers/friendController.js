var User = require('../Models/user');
var Friend = require('../Models/friend');
var async = require('async');

module.exports.addAFriend = function(req,res)
{
	var userNumber = req.body.userNumber;
	var friendName = req.body.friendName;
	var friendNumber = req.body.friendNumber;
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
		  console.log(isUserFriend);
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
			var friend = new FriendSchema();
			friend.friendName = friendName;
			friend.friendNumber = friendNumber;
			User.update({mobileNumber:userNumber},
			      { "$push": { "friends": friend } },
			      { "new": true, "upsert": true },
			      function (err, user)
		 {
			 	if(err) return err;
				console.log('Added user that doesnt exists');
				callback(null,"Success");
				return;
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
