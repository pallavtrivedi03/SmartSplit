var User = require('../Models/user');
var Friend = require('../Models/friend');

module.exports.addAFriend = function(req,res)
{
	console.log("hit");
	var userNumber = req.body.userNumber;
	var friendName = req.body.friendName;
	var friendNumber = req.body.friendNumber;
	console.log(userNumber);

	User.findOne({mobileNumber:friendNumber}, function(err,isUserFriend)
	{
		if(err) return err;
		if(isUserFriend)
		{
		  var FriendSchema = Friend.FriendSchema;
		  let userFriend = new FriendSchema();
		  userFriend.friendName = isUserFriend.name;
		  userFriend.friendEmail = isUserFriend.email;
	          userFriend.friendNumber = isUserFriend.mobileNumber;
		  console.log(userFriend);

		  User.update({mobileNumber:userNumber},
			      { "$push": { "friends": userFriend } },
			      { "new": true, "upsert": true },
			      function (err, user)
		 {
			if(err)	return err;
			console.log('updated ',user);
			var friend = new FriendSchema();
			  User.findOne({mobileNumber:userNumber},function(err,userData)
			  {
				if(err) return err;
		 		console.log("userData ",userData);
				friend.friendName = userData.name;
	          		friend.friendEmail = userData.email;
	                  	friend.friendNumber = userData.mobileNumber;
				console.log(friend);
		          User.update({mobileNumber:userFriend.friendNumber},{ "$push": { "friends": friend } },{ "new": true, "upsert": true },
				function (err, user)
			 {
				if(err)	return err;
			        console.log('updated ',user);
			  });
			  });
		  });
		}
	});


};
