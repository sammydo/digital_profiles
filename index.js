var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Start express application
var app = express();

// Include router
var routes = require('./config/routes');

// Role manager middleware
var roleMapper = require('./middleware/roleManager');

// Connect to database
mongoose.connect(process.env.MONGODB_URI, function() {
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
});
// testttt
// Declare public folder for static assets
app.use(express.static(__dirname + '/public'));

// Set the view engine to be ejs
app.set('view engine', 'ejs');

// Parse body to get data
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.status(200).render('index');
});

// Add the router
app.use(routes);

// Create server
app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
});

module.exports = app;
