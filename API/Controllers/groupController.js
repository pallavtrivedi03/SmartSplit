var Group = require('../Models/groups');
var shortId = require('shortid');
var User = require('../Models/user');
var GroupId = require('../Models/groupId');
var Group = require('../Models/groups');
var Member = require('../Models/members')
var async = require('async');

module.exports.addGroup = function(req,res)
{
	console.log('members ',req.body.members);
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
		console.log("inside");
		var GroupIdSchema = GroupId.GroupSchema;
		var MemberSchema = Member.MemberSchema;
		async.each(memberArray,function(mem,callback)
	  {
			var member = new MemberSchema();
			var groupIdObj = new GroupIdSchema();
			groupIdObj.groupId = groupId;
			member.memberPhone = mem.phone;
			console.log(member);
			Group.update({groupId:groupId}, {"$push":{"members":member}}, { "new": true, "upsert": true }, function (err, user)
					{
							if(err) return err;
							User.update({mobileNumber:member.memberPhone}, { "$push": { "groupIds":groupIdObj }},{ "new": true, "upsert": true },function (err, user)
							{
								if(err)  return err;
								console.log('saved');
							});
					});
	  });

		var groupIdObj = new GroupIdSchema();
		User.update({mobileNumber:adminNumber}, { "$push": { "groupIds": groupIdObj } },{ "new": true, "upsert": true },function (err, user)
			{
				if(err)  return err;
				var member = new MemberSchema();
				member.memberPhone = adminNumber;
				Group.update({groupId:groupId}, {"$push":{"members":member}}, { "new": true, "upsert": true }, function (err, user)
						{
								if(err) return err;
						});
				console.log('saved');
			});
	});

};

module.exports.getCommonGroups = function(req,res)
{
	var userNumber = req.body.userNumber;
	var friendNumber = req.body.friendNumber;

	Group.find({"members.memberPhone":[userNumber,friendNumber]},function(err,data)
	{
		if(err) return err;
		console.log(data);
	});
};
