var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Friend = new Schema(
  {
      name:String,
      mobileNumber:Number,
      commonGroups:[{groupId:String}],
      transactionsId:[]
  }
);

module.exports = mongoose.model('Friend',Friend);
