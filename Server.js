var express = require('express');
var app = express();
var port = 3000;

var mongoose = require('mongoose'),
Transaction = require('./API/Models/transaction'),
User = require('./API/Models/user'), //created model loading here


bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Users');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./API/Routes/Routes'); //importing route
routes(app); //register the route

app.listen(port,function(){
  console.log('Server started on port ' + port);
});
