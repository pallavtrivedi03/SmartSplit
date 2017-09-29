'use strict';

module.exports = function(app) {
  var setupController = require('../Controllers/UserSetupController');


  app.get('/',function(req,res){
    res.send('We are happy to see you using SmartSplit');
  });

  // registerUser Route
  app.route('/signUp')
    .post(setupController.registerUser);

  // signIn Route
  app.route('/signIn')
     .post(setupController.signIn);
};
