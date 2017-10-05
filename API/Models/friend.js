var mongoose = require('mongoose');
var Transaction = require('./transaction');
var Schema = mongoose.Schema;

var Friend = new Schema({

friendName:{
	type:String,
	required:true
},
friendEmail:{
	type:String,
	required:true
},
friendNumber:{
	type:String,
	required:true
},
transactions:[{type:Transaction}],
commonGroupIds:
	[{groupIds: {type:String} }]
});

module.exports = Friend;
module.exports.FriendSchema = mongoose.model('Friend',Friend);
