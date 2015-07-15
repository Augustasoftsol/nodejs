

var app = require('./app/config/express')();


// Start the app by listening on <port>
app.listen(8080);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + 8080);