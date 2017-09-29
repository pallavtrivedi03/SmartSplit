'use strict';

var mongoose = require('mongoose'),
jwt = require('jsonwebtoken'),
User = mongoose.model('User');

exports.registerUser = function(req, res) {

    //find if user already exists
    User.findOne({
        mobileNumber: req.body.mobileNumber
      }, function(err, doesUserExists) {

        if (err) throw err;

        if (doesUserExists) {
          res.json({ success: false, message: 'Number already registered with SmartSplit' });
        }
        else if (!doesUserExists) {

          var newUser = new User(req.body);
          newUser.save(function(err, user) {
            if (err)
            {
              console.log('in the error');
              res.send(err);
            }
            else {
              // user is saved
              // create a token
              var expirationTime = {'expiresIn': '3h'};
              var token = jwt.sign(user.toObject(), req.body.mobileNumber,expirationTime);
              // return the information including token as JSON
              res.json({
                success: true,
                message: 'Registered successfully',
                token: token
              });
          }

        });
            }
          });
        };


exports.signIn = function(req,res)
{
	let password = req.body.password;
	let userName = req.body.name;
	User.findOne({mobileNumber:req.body.mobileNumber}, function(err,doUserExists)
	{
	   if(err) return err;
           
   	   if(doUserExists)
	   {
		if(password == doUserExists.password && userName == doUserExists.name)
		{
		   var expirationTime = {'expiresIn': '3h'};
		   console.log(doUserExists);
		   let token = jwt.sign(doUserExists.toObject(), req.body.mobileNumber,expirationTime);
		   console.log(token);
		   res.json(
		   {
			success: true,
                	message: 'SignIn Successful',
                	token: token
		   });
		}
		else
		{
		   res.json(
		   {
			success: false,
                	message: 'Invalid credential'
		   });
		}
 	   }
	   else
	   {
		res.json(
		   {
			success: false,
                	message: 'User doesnt exists'
		   });
           }
           
	    
	});
}
