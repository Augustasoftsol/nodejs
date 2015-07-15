/**
 * Created by vkrishna on 7/6/2015.
 */


var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');  // Passport authentication
var jwt = require('jsonwebtoken');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
var bodyParser = require('body-parser'); // used to get the request body value
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var async = require('async');
var ObjectID = require('mongodb').ObjectID;

var connect = require('connect');
var csv = require('csv-stream');
var request = require('request');

module.exports = function () {


    var app = express();
    var db1 = mongoose.connect('mongodb://66.219.101.188/i800').connection;

//Models
    var register = require('../models/registermodel'); //Register Model
    var company = require('../models/companyModel'); //company Model
    var department = require('../models/departmentModel'); //department Model
    var agent = require('../models/agentModel'); //agent Model
    var security = require('../models/securityModel'); //security Model
    var config = require('../config/config');
    var consolidate = require('consolidate');
    var methodOverride = require('method-override');
    var multer = require('multer');  // to recevie file in request
    var xmlparser = require('express-xml-bodyparser');
    var js2xmlparser = require("js2xmlparser");


    app.use(passport.initialize());
    app.use(passport.session());


    var apiRoutes = express.Router();


//Models

    var company = require('../models/companyModel'); //company Model
    var config = require('./config');
    var consolidate = require('consolidate');

    var apiRoutes = express.Router();


    var app = express();
   app.use(multer({dest: './uploads/'}))

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride());

    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    /* xmlparser for to read xml requst body*/
    app.use(xmlparser());

    app.use(express.static("C:/inetpub/iisnode/www/test1/app"));
    // Set swig as the template engine
    app.engine('server.view.html', consolidate['swig']);
    app.set('view engine', 'server.view.html');
    app.set('views', 'C:/inetpub/iisnode/ww/test1/app/views');
   // app.set('views', '../views');




    app.set('superSecret', "Awrtdddsfkiioa99346nmkj24682");



    /*return response in both json and  xml format. Based on request.accepts */
    app.use(function (req, res, next) {
        res.sendData = function (obj) {
            if (req.accepts('json') || req.accepts('text/html')) {
                res.header('Content-Type', 'application/json');
                console.log('json')
                res.send(obj);
            } else if (req.accepts('application/xml')) {
                res.header('Content-Type', 'text/xml');
                res.send(js2xmlparser("result", JSON.stringify(obj)));
            } else {
                res.send(406);
            }
        };

        next();
    });



    // app.use(bodyParser({ keepExtensions: true, uploadDir:  + "E:/KRISHNA/Projects/i800/Code/i800/app" }));


    passport.use('local', new LocalStrategy(
        function (email, password, done) {
            register.findOne({email: email}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
                }

                // if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
                var s = user.validPassword(password);

                if (!s) {
                    return done(null, false, {message: 'Incorrect password.'});
                }

                return done(null, user);
            });
        }
    ));

// route middleware to verify a token
    apiRoutes.use(function (req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function (err, user) {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    req.user = user;
                    // if everything is good, save to request for use in other routes
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
// Deserialize sessions
    passport.deserializeUser(function (id, done) {
        User.findOne({
            _id: id
        }, '-salt -password', function (err, user) {
            done(err, user);
        });
    });


    var options = {
        //delimiter : '\t', // default is ,
        endLine: '\n', // default is \n,
        //columns : ['FirstName', 'LastName'], // by default read the first line and use values found as columns
        escapeChar: '"', // default is an empty string
        enclosedChar: '"' // default is an empty string
    }
    var csvStream = csv.createStream(options);
    request('http://returnsite.augusta-qa.com/Agents.csv').pipe(csvStream)
        .on('error', function (err) {
            console.error(err);
        })
        .on('data', function (data) {
            // outputs an object containing a set of key/value pair representing a line found in the csv file.
            console.log(data);
        })

    require('../routes/route')(app, apiRoutes);
    return app;
}
//module.exports






