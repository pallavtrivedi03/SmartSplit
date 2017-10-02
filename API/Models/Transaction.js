'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
Bill = mongoose.model('Bill');

var TransactionSchema = new Schema({
  with:String,
  total:String,
  bills:[{type:mongoose.Schema.Types.ObjectId, ref:'Bill'}]
});

module.exports = mongoose.model('Transaction', TransactionSchema);
