var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Task = require('./api/models/model'),
  bodyParser = require('body-parser');

//var DBURL = 'mongodb://linux-dev-tone-ai:IcRFZuTc67ebs6A1W77Sex6HXzSTnK2Bqbf7LiL1xzMOBzslMwICwG8kCzPSImZuwpI2wgkHRa3Rd88pf2W1dg==@linux-dev-tone-ai.documents.azure.com:10255/knolbot?ssl=true&replicaSet=globaldb';
var DBURL = 'mongodb://localhost:27017/knolbot';

mongoose.Promise = global.Promise;
mongoose.connect(DBURL); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/routes');
routes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);