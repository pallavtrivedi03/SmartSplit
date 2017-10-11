var mongoose = require('mongoose');
var Group = require('../Models/groups');
var shortId = require('shortid');
var Friend = require('../Models/friend');
var User = mongoose.model('User');
var GroupId = require('../Models/groupId');
var Group = require('../Models/groups');
var Member = require('../Models/members');
var friendController = require('./friendController');
var async = require('async');

module.exports.addGroup = function(req,res)
{
	var adminNumber = req.body.adminNumber;
	var memberArray = req.body.members;
	var groupId = shortId.generate();
	var group = new Group();
	group.groupName = req.body.groupName;
	group.groupId = groupId;
	group.amount = req.body.amount;
	var memberArray = req.body.members;
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
		if(err)	return err;
		console.log("groupAdded");
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
					for(var k = 0;k<memberArray.length;k++)
					{
						modifiedArray.push(memberArray[k]);
					}
					for(var i=0; i<friendArray.length;i++)
					{		
						for(var j=0;j<memberArray.length;j++)
						{
							console.log(friendArray[i].friendNumber+" "+memberArray[j].friendNumber);
							if(friendArray[i].friendNumber == memberArray[j].friendNumber)
							{
								intersection.push(memberArray[j]);
								var hasElement = modifiedArray.indexOf(memberArray[j]);
								console.log(hasElement);
								if(hasElement >= 0)
								{
									modifiedArray.splice(hasElement,1);
								}
							}			
						}
					}
						
					User.update({mobileNumber:mem.friendNumber},{"$addToSet":{"friends":{"$each":modifiedArray}}},
						function(err,nonExistingUserMembersx)
						{	
							if(err)	return err;
							User.update({mobileNumber:mem.friendNumber},
							{"$pull":{"friends":{"friendNumber":mem.friendNumber}}},
							function(err,pullUser)
							{
								if(err)	return err;
							});
						});
				}
				else
				{
					console.log("else");
					var user = new User();
					console.log(mem);
					user.name = mem.friendName;
					user.mobileNumber = mem.friendNumber;
					user.isRegistered = false;
					console.log(user);
					user.save(function(error,userCreated)
					{
						if(error)	return error;
						User.update({mobileNumber:mem.friendNumber},{"$addToSet":{"friends":{"$each":memberArray}}},
						function(err,nonExistingUserMembersx)
						{	
							if(err)	return err;
							console.log("Updated");
							User.update({mobileNumber:mem.friendNumber},
							{"$pull":{"friends":{"friendNumber":mem.friendNumber}}},
							function(err,pullUser)
							{
								if(err)	return err;
							 	console.log("Self Remove");
							});
							console.log("Added member");
						});
						console.log("Created");
					});
				}
			});	
		});
	
};

function addGroupMember(member,groupId,callback)
{
	Group.update({groupId:groupId}, {"$push":{"members":member}}, { "new": true, "upsert": true }, function (err, user)
			{
				if(err)
				{
					callback(err,null);
					return;
				}
				callback(null,member);
			});
};

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
