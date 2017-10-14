var _                = require('lodash');
var shortId          = require('shortid');
var async            = require('async');

//Models
var mongoose         = require('mongoose');
var User             = mongoose.model('User');
var Group            = require('../Models/groups');
var Friend           = require('../Models/friend');
var GroupId          = require('../Models/groupId');
var Group            = require('../Models/groups');
var Member           = require('../Models/members');

module.exports.addGroup = function(req,res)
{
	var adminNumber = req.body.adminNumber;
	var memberArray = req.body.members;
	var amount = req.body.amount;
	var groupName = req.body.groupName;
	var groupId = shortId.generate();
	group(adminNumber,memberArray,amount,groupId,groupName,function(err,result)
{
	if(err)
	{
		res.json({"success":false,"message":"Unable to add group"});
	}
	else {
		res.json({"success":false,"message":"Group added successfully"});
	}
});

};

function group(adminNumber,memberArray,amount,groupId,groupName,callback)
{
	var group = new Group();
		group.groupId = groupId;
		group.groupName = groupName;
	group.amount = amount;

	var MemberSchema = Member.MemberSchema;
	var GroupSchema = Group.GroupSchema;
	var GroupIdSchema = GroupId.GroupSchema;
	console.log(memberArray);
	for(var i=0;i<memberArray.length;i++)
	{
		group.members.push(memberArray[i]);
	}
	group.save(function(err,groupAdded)
	{
		if(err)
		{
			callback(false,null);
				return;
		}
		else {
			callback(null,true);
			return;
		}
	});
	async.each(memberArray,function(mem,callback)
		{
			console.log("inside");
			User.findOne({mobileNumber:mem.friendNumber},function(err,doUserExist)
			{
				if(err)  return err;
				console.log(doUserExist);
				if(doUserExist)
				{
					var intersection = [];
					var modifiedArray = [];
					var friendArray = doUserExist.friends;
					// This for loop is to remove _id from friendArray
					for(var i=0;i<friendArray.length;i++)
					{
					   intersection.push({friendName:friendArray[i].friendName,friendNumber:friendArray[i].friendNumber});
					}

					// Gives friends which are not present in the array of user
					var modifiedArray = _.differenceWith(memberArray,intersection,_.isEqual);
					for(var i=0;i<modifiedArray.length;i++)
					{
						if(modifiedArray[i].friendNumber == mem.friendNumber)
						{
							modifiedArray.splice(i,1);
						}
					}
					// Adds members in the friendsArray
					User.update({mobileNumber:mem.friendNumber},{"$addToSet":{"friends":{"$each":modifiedArray}}},
						function(err,nonExistingUserMembersx)
						{
							if(err)
							{
								callback(false,null);
							}
							else {
								callback(null,true);
							}
						});
				}
				else
				{
					var updated = [];
					console.log("else");
					var user = new User();
					console.log(mem);
					user.name = mem.friendName;
					user.mobileNumber = mem.friendNumber;
					user.isRegistered = false;
					console.log(user);
					for(var i=0;i<memberArray.length;i++)
					{
					   updated.push(memberArray[i]);
					}
					for(var i=0;i<updated.length;i++)
					{
						if(updated[i].friendNumber == mem.friendNumber)
						{
							updated.splice(i,1);
						}
					}
					console.log("updated length is "+updated.length);
					user.save(function(error,userCreated)
					{
						if(error)
						{
							console.log("save nhi hua");
							return error;
						}
						User.update({mobileNumber:mem.friendNumber},{"$addToSet":{"friends":{"$each":updated}}},
						function(err,nonExistingUserMembersx)
						{
							if(err)
							{
								callback(false,null);
							}
							else {
								callback(null,true);
							}
						});
					});
				}
			});
		});
}



module.exports.getCommonGroups = function(req,res)
{
	var userNumber = req.body.userNumber;
	var friendNumber = req.body.friendNumber;

	Group.find({"members.memberPhone":{ $all: [userNumber,friendNumber] } },function(err,data)
	{
		if(err) return err;
		console.log(data);
	});
};


module.exports.addGroupForTransaction = function(createdBy,membersArray,amount,groupId,groupName,callback)
{
		group(createdBy,membersArray,amount,groupId,groupName,function(err,result)
	{
		if(err)
		{
			callback(false,null);
		}
		else {
			callback(null,true);
		}
	});
};
