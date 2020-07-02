// require express
var express = require('express');
// require express handlebars
var exphbs = require('express-handlebars');
// require and configure dotenv
require('dotenv').config();

// setup express app
var app = express();

// configure PORT
var PORT = process.env.PORT || process.env.DEV_PORT;

// configure middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// define static directory
app.use(express.static('public'));

// configure view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// import models
var db = require('./models');

// import routes
require('./routes/api-routes.js')(app);
require('./routes/view-routes.js')(app);

// sync models and start the app
db.sequelize.sync({ force: true }).then(function () {
    app.listen(PORT, function () {
        console.log('Server listening on: http://localhost:' + PORT);
    });
});
