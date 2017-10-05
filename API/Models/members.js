var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Member = new Schema(
{
memberName:String,
amount1:Number,
amount2:Number,
memberPhone:Number
});

module.exports = Member;
module.exports.MemberSchema = mongoose.model('Member',Member);
