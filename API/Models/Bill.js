'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BillSchema = new Schema({
  description:String,
  amount:String,
  paidBy:String,
  splitEqually:Boolean
});

module.exports = mongoose.model('Bill', BillSchema);
