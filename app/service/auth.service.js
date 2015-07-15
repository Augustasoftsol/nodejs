/**
 * Created by vkrishna on 7/7/2015.
 */

var register = require('../models/registermodel'); //Register Model
var config = require('../config/config');
var express = require('express');
var util = require('../config/util');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');
var result = [];
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
/* validate the company name, email and username is already exist or not */



exports.validate = function (req, res) {


    if (info.companyName) {

        var user = register.findOne({companyName: req.body.companyName}, function (err, user) {
            if (user) {

                console.log(result);
                result.push("Company already registered");
                //    return res.json({ devMessage: "Company already registered", userMessage:"Company already registered",success:false });
            }
        });
    }
    if (info.contactEmail) {
        var user = register.findOne({contactEmail: req.body.contactEmail}, function (err, user) {
            if (user) {

                console.log(result);
                result.push("Email already used");
                //    return res.json({ devMessage: "Email already used", userMessage:"Email already used",success:false });
            }
        });
    }
    if (info.username) {
        var user = register.findOne({username: req.body.username}, function (err, user) {
            if (user) {
                console.log('userns' + result);

                result.push("Username already taken");
                //   return  res.json({ devMessage: "Username already taken", userMessage:"Username already taken",success:false });
            }
        });

    }


};

exports.signup = function (req, res, next) {
    // console.log(this.validate(req, res));
    var file = req.files;
    var host = req.get('host');


    async.waterfall([
        // Generate random token
        function (done) {
            crypto.randomBytes(20, function (err, buffer) {
                var token = buffer.toString('hex');
                done(err, token);
            });
        }, function (token, done) {
            var newUser = new register({
                companyName: req.body.companyName,
                companyPhone: req.body.companyPhone,
                description: req.body.description,
                contactFirstName: req.body.contactFirstName,
                contactLastName: req.body.contactLastName,
                contactEmail: req.body.contactEmail,
                contactPhone: req.body.contactPhone,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                zipcode: req.body.zipcode,
                username: req.body.username,
                emailConfirmToken: token,
                emailConfirmExpires: Date.now() + 3600000, // 1 hour
                // password:req.body.password,
                logoPath: '',
                active: true

            });
            newUser.save(function (err, user) {

                if (err) {
                    return res.sendData({
                        success: false,
                        devMessage: err.message,
                        userMessage: err.message
                    });
                }
                // done(err, token, user);
                if (user && file.myFile != undefined) {
                    fs.readFile(file.myFile.path, function (err, original_data) {
                        if (err) {

                        }
                        fs.rename(file.myFile.path, 'uploads/' + user._id + '.png', function (err, data) {
                            if (err) {
                                console.log(err);
                            }
                            user.logoPath = host + '/upload/' + user._id + '.png';

                            user.save(function (err, res) {
                                if (res) {
                                    console.log('file updated');
                                    done(err, token, user);
                                }
                            });
                        });

                    });
                }
                else {
                    done(err, token, user);
                }
            });

        }, function (token, user, done) {
            console.log('emaol');
            res.render('templates/account-confirm-email', {
                name: user.companyName,
                appName: config.app.title,
                url: 'http://' + req.headers.host + '/confirm/' + token
            }, function (err, emailHTML) {
                done(err, emailHTML, user);
            });
        },
        // If valid email, send reset email using service
        function (emailHTML, user, done) {
                  var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email.auth.user,
                    pass: config.email.auth.pass
                }
            });
            var mailOptions = {
                to: user.contactEmail,
                from: config.email.mailFrom,
                subject: 'i800 - Company registration - confirmation required',
                html: emailHTML
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                if (!err) {
                    return res.json({
                        success: true,
                        devMessage: 'An email has been sent to ' + user.contactEmail + ' with further instructions.',
                        userMessage: 'An email has been sent to ' + user.contactEmail + ' with further instructions.'
                    });

                }

                done(err);
            });
        }
    ], function (err) {

        if (err)
            return res.sendData({
                success: false,
                devMessage: err.message,
                userMessage: err.message
            });

    });
};

exports.signin = function (req, res, next) {
    passport.authenticate('local', {session: true}, function (err, user, info) {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            // Remove sensitive data before login
            // req.login(user, function(err) {
            //    if (err) {

            //      res.status(400).send(err);
            //  } else {

            //    res.json(user);
            // }
            //});
            var token = jwt.sign(user, config.superSecret, {
                expiresInMinutes: 1440
            }); // expires in 24 hours

            res.json({
                success: true,
                devMessage: "Valid user. Token added with response",
                userMessage: "Successful login",
                token: token
            });

        }
    })(req, res, next);
};


exports.forgot = function (req, res, next) {
    async.waterfall([
        // Generate random token
        function (done) {
            crypto.randomBytes(20, function (err, buffer) {
                var token = buffer.toString('hex');
                done(err, token);
            });
        },
        // Lookup user by username
        function (token, done) {
            if (req.body.email) {
                register.findOne({
                    contactEmail: req.body.email
                }, '-salt -password', function (err, user) {
                    if (!user) {
                        return res.json({
                            success: false,
                            devMessage: 'No account with that username has been found',
                            userMessage: 'No account with that username has been found'
                        });

                    }
                    else {
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                        user.save(function (err) {

                            done(err, token, user);
                        });
                    }
                });
            } else {
                return res.json({
                    success: false,
                    devMessage: 'Email field must not be blank',
                    userMessage: 'Email field must not be blank'
                });
            }
        },
        function (token, user, done) {

            res.render('templates/reset-password-email', {
                name: user.companyName,
                appName: config.app.title,
                url: 'http://' + req.headers.host + '/reset/' + token
            }, function (err, emailHTML) {
                done(err, emailHTML, user);
            });
        },
        // If valid email, send reset email using service
        function (emailHTML, user, done) {

            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email.auth.user,
                    pass: config.email.auth.pass
                }
            });
            var mailOptions = {
                to: user.contactEmail,
                from: config.email.mailFrom,
                subject: 'Password Reset',
                html: emailHTML
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                if (!err) {
                    return res.json({
                        success: true,
                        devMessage: 'An email has been sent to ' + user.email + ' with further instructions.',
                        userMessage: 'An email has been sent to ' + user.email + ' with further instructions.'
                    });

                }

                done(err);
            });
        }
    ], function (err) {
        if (err) return next(err);
    });
};


/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
    // Init Variables
    var passwordDetails = req.body;
    console.log(req.body.token);
    async.waterfall([

        function (done) {

            register.findOne({

                resetPasswordToken: req.body.token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, function (err, user) {
                console.log(user);
                if (!err && user) {
                    if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                        user.password = passwordDetails.newPassword;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function (err) {
                            if (err) {
                                return res.json({
                                    success: false,
                                    devMessage: errorHandler.getErrorMessage(err),
                                    userMessage: 'An error occured'
                                });
                                // return res.status(400).send({
                                //     message: errorHandler.getErrorMessage(err)
                                // });
                            } else {
                                req.login(user, function (err) {
                                    if (err) {
                                        res.json({
                                            success: false,
                                            devMessage: errorHandler.getErrorMessage(err),
                                            userMessage: 'An error occured'
                                        });
                                        //res.status(400).send(err);
                                    } else {
                                        // Return authenticated user
                                        return res.json({
                                            success: true,
                                            devMessage: user,
                                            userMessage: 'Password changed successfully'
                                        });


                                        done(err, user);
                                    }
                                });
                            }
                        });
                    } else {
                        return res.json({
                            success: false,
                            devMessage: 'Passwords do not match',
                            userMessage: 'Passwords do not match'
                        });

                    }
                } else {
                    return res.json({
                        success: false,
                        devMessage: 'Password reset token is invalid or has expired.',
                        userMessage: 'Password reset token is invalid or has expired.'
                    });

                }
            });
        },
        function (user, done) {
            res.render('templates/reset-password-confirm-email', {
                name: user.companyName,
                appName: config.app.title
            }, function (err, emailHTML) {
                done(err, emailHTML, user);
            });
        },
        // If valid email, send reset email using service
        function (emailHTML, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email.auth.user,
                    pass: config.email.auth.pass
                }
            });
            var mailOptions = {
                to: user.contactEmail,
                from: config.email.mailFrom,
                subject: 'Your password has been changed',
                html: emailHTML
            };

            smtpTransport.sendMail(mailOptions, function (err) {
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
    });
};

/**
 * Change Password
 */
exports.changePassword = function (req, res) {
    // Init Variables

    var passwordDetails = req.body;
    console.log(req.user);

    if (req.user) {
        if (passwordDetails.newPassword) {
            register.findById({"_id": new ObjectID(req.user._id)}, function (err, user) {
                if (!err && user) {
                    if (user.authenticate(passwordDetails.currentPassword)) {
                        if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                            user.password = passwordDetails.newPassword;

                            user.save(function (err) {
                                if (err) {
                                    return res.json({
                                        success: false,
                                        devMessage: errorHandler.getErrorMessage(err),
                                        userMessage: 'Error occurred'
                                    });
                                } else {
                                    req.login(user, function (err) {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            res.json({
                                                success: true,
                                                devMessage: 'Password changed successfully',
                                                userMessage: 'Password changed successfully'
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            return res.json({
                                success: false,
                                devMessage: 'Passwords do not match',
                                userMessage: 'Passwords do not match'
                            });

                        }
                    } else {
                        return res.json({
                            success: false,
                            devMessage: 'Current password is incorrect',
                            userMessage: 'Current password is incorrect'
                        });

                    }
                } else {
                    return res.json({
                        success: false,
                        devMessage: 'User is not found',
                        userMessage: 'User is not found'
                    });

                }
            });
        } else {

            return res.json({
                success: false,
                devMessage: 'Please provide a new password',
                userMessage: 'Please provide a new password'
            });
        }
    } else {
        return res.json({
            success: false,
            devMessage: 'User is not signed in',
            userMessage: 'User is not signed in'
        });

    }

};


