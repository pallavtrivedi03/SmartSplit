var mongoose = require('mongoose');
//var Transaction = require('./transaction');
var Schema = mongoose.Schema;

var Friend = new Schema({

friendName:{
	type:String,
	required:true
},
friendEmail:{
	type:String,
	required:false
},
friendNumber:{
	type:String,
	required:true
}
});

module.exports = Friend;
module.exports.FriendSchema = mongoose.model('Friend',Friend);
