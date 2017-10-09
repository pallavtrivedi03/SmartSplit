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
	var memberArray = req.body.members;
	var MemberSchema = Member.MemberSchema;
	var GroupSchema = Group.GroupSchema;
	var GroupIdSchema = GroupId.GroupSchema;
	group.save(function(err,result)
	{
		if(err)	return err;
		console.log("group added");
		var count = 1;
		var threshold = 1;
		var length = memberArray.length;
		async.each(memberArray,function(mem,callback)
		{
			var outerMember = mem;
			async.each(memberArray,function(mem2,callback)
			{
				if(threshold < count)
				{
					count++;
					friendController.addFriend(outerMember.phone,mem2.phone,mem2.name,function(err,result)
					{
						if(err) return err;
						console.log('added');
					});
					console.log("reached");
					return;
				}
				count++;
				console.log(count);
			});
			count = 1;
			threshold++;
		});
		async.each(memberArray,function(mem,callback)
	  	{
			var member = new MemberSchema();
			var groupIdObj = new GroupIdSchema();
			groupIdObj.groupId = groupId;
			member.memberPhone = mem.phone;
			Group.update({groupId:groupId}, {"$push":{"members":member}}, { "new": true, "upsert": true }, function (err, user)
			{
				if(err)
				{
					return;
				}
				console.log("Added Member");
			});
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
