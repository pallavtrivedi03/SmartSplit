var mongoose = require('mongoose');
var Friend = require('./friend');
var GroupId = require('./groupId');
var Schema = mongoose.Schema;

var User = new Schema({

name:{
	type:String,
	required:true
},
email:{
	type:String,
	required:true
},
mobileNumber:{
	type:String,
	required:true
},
password:{
	type:String,
	required:true
},
friends:[{type:Friend}],
groupIds:[
{type:GroupId}
]
});

module.exports = mongoose.model('User', User);
