// require express
var express = require('express');
// // require and configure dotenv
// require('dotenv').config()
// console.log('MAPBOX=' + process.env.MAPBOX);

// setup express app
var app = express();
var PORT = process.env.PORT || 8080;

// require models for syncing
var db = require('./models');

// configure middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// define static directory
app.use(express.static('public'));

// routes
require('./routes/api-routes.js')(app);
require('./routes/html-routes.js')(app);

// sync models and start the app
db.sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log('Listening on PORT ' + PORT);
    });
});
