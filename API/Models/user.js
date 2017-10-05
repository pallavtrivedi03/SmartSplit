var mongoose = require('mongoose');
var Friend = require('./friend');
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
{groupId:Number}
]
});

module.exports = mongoose.model('User', User);
