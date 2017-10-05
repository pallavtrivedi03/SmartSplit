var Group = require('../Models/groups');
var shortId = require('shortid');
var User = require('../Models/user');
var Group = require('../Models/groups');
var Member = require('../Models/members');

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
		
		var MemberSchema = Member.MemberSchema;
	
		for (var i = 0, len = memberArray.length; i < len; i++) 
		{
			var mem = memberArray[i];
			console.log(mem);
			var member = new MemberSchema();
			member.memberPhone = mem.phone;
			console.log(member);
			Group.update({groupId:groupId},	
				     {"$push":{"members":member}},
				     { "new": true, "upsert": true },
			      	     function (err, user) 
					{
					if(err) return err;
					var groupObj ={"groupId":groupId};
				        User.update({mobileNumber:member.memberPhone},
			      			{ "$push": { "groupIds":groupObj  } },
			      			{ "new": true, "upsert": true },
			      			function (err, user) 
						{
							if(err)  return err;
							console.log('saved');
						});
					});
				     
		}
					User.update({mobileNumber:adminNumber},
			      			{ "$push": { "groupIds": {groupId:groupId} } },
			      			{ "new": true, "upsert": true },
			      			function (err, user) 
						{
							if(err)  return err;
							console.log('saved');
						});
	});

	
};

