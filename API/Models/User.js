'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
Transaction = mongoose.model('Transaction');

var UserSchema = new Schema({
  mobileNumber:String,
  name:String,
  password:String,
  email:String,
  transactions:[{type:mongoose.Schema.Types.ObjectId, ref:'Transaction'}]
});

module.exports = mongoose.model('User', UserSchema);
