var mongoose = require('mongoose');
var Friend = require('./friends');
var Schema = mongoose.Schema;

var Friend = new Schema(
  {
      name:String,
      mobileNumber:Number,
      commonGroups:[{groupId:String}],
      transactionsId:[]
  }
);

var user = new Schema(
  {
    mobileNumber:String,
    name:String,
    password:String,
    email:String,
    friends:[],
    groupIds:[{groupIds:Number}]
  }
);

module.exports = mongoose.model('User',user);
