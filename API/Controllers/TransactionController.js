'use strict';

var mongoose = require('mongoose'),
jwt = require('jsonwebtoken'),
User = mongoose.model('User'),
Transaction = mongoose.model('Transaction'),
Bill = mongoose.model('Bill');

exports.addABill = function(req,res)
{
  let description = req.body.password;
	let useramoutName = req.body.name;
  let paidBy = req.body.name;
  let splitEqually = req.body.name;

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, req.body.mobileNumber, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        console.log('token successfully verified');

              //make a bill--> make a transaction and update
              var newBill = new Bill(req.body);

              var newTransation = new Transaction();
              newTransation.bills.push(newBill);
              console.log(newTransation);
              User.update({"mobileNumber":req.body.mobileNumber},{"$push":{"transactions":newTransation}},function(error,success)
              {
                if (success)
               {
                 console.log('success');
                  return res.json({ success: true, message: 'Bill added successfully' });
                }
                else {
                  console.log('failed');
                     return res.json({ success: false, message: 'Unable to add bill' });
                }
              });
    }});

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
};
