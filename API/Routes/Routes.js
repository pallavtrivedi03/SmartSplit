'use strict';
var express = require('express');

module.exports = function(app) {
  var setupController = require('../Controllers/UserSetupController'),
  transactionController = require('../Controllers/transactionController');
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
     .post(setupController.forgotPassword)

  // add a bill route
  app.route('/addABill')
    .post(transactionController.addABill)

};
