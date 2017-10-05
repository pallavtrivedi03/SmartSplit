'use strict';
var express = require('express');

module.exports = function(app) {
  var setupController = require('../Controllers/UserSetupController'),
<<<<<<< HEAD
  friendController = require('../Controllers/friendController'),
  groupController = require('../Controllers/groupController'),
  transactionController = require('../Controllers/TransactionController');
=======
  transactionController = require('../Controllers/transactionController'),
  friendController = require('../Controllers/friendController');
>>>>>>> Merging Add Friend Api
  var apiRoutes =  express.Router();

  app.get('/',function(req,res){
    res.send('We are happy to see you using SmartSplit');
  });

  // registerUser Route
  app.route('/signUp')
    .post(setupController.registerUser);

  // signIn Route
  app.route('/signIn')
     .post(setupController.signIn);

  app.route('/forgotPassword')
     .post(setupController.forgotPassword);

  // add a bill route
  app.route('/addABill')
    .post(transactionController.addABill);
<<<<<<< HEAD
=======

    app.route('/addAFriend')
       .post(friendController.addAFriend);

       app.route('/getUsers')
          .get(setupController.getUsers);
>>>>>>> Merging Add Friend Api

  // add a bill route
  app.route('/addAFriend')
    .post(friendController.addAFriend);
  
  // add a bill route
  app.route('/addABill')
    .post(transactionController.addABill);

  // add a bill route
  app.route('/addGroup')
    .post(groupController.addGroup);
};
