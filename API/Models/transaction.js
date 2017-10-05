var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Transaction = new Schema({

description:{
	type:String,
	required:true
},
transactionId:{
	type:String,
	required:true
},

amount:{
	type:Number,
	required:true
}
});

module.exports = Transaction;
module.exports.TransactionSchema = mongoose.model('Transaction', Transaction);
