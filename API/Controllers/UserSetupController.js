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
