var Group = require('../Models/groups');
var shortId = require('shortid');
var User = require('../Models/user');
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

	group.save(function(err,group)
	{
		if(err)	return err;
		var GroupIdSchema = GroupId.GroupSchema;
		var MemberSchema = Member.MemberSchema;
		async.each(memberArray,function(mem,callback)
	  	{
			var member = new MemberSchema();
			var groupIdObj = new GroupIdSchema();
			groupIdObj.groupId = groupId;
			member.memberPhone = mem.phone;
			User.findOne({mobileNumber:mem.phone},function(err,userExist)
			{
				if(err)	return err;
				if(userExist)
				{
					User.findOne({mobileNumber:adminNumber,"friends.mobileNumber":mem.phone},function(err,isFriend)
					{
						if(err)  return err;
						if(isFriend)
						{
							console.log("isFriend");
						}
						else friendController.addFriend(adminNumber,mem.phone,mem.name,function(err,result)
						{
							if(err)	return err;
							console.log("friend Added");
						});
					});
				}
				else console.log("User doesn't exists");
			});	
			console.log(member);
			Group.update({groupId:groupId}, {"$push":{"members":member}}, { "new": true, "upsert": true }, function (err, user)
			{
				if(err) return err;
				console.log('Saved');
			});
	  	});
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
