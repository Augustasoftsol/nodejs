/**
 * Created by vkrishna on 7/7/2015.
 */

var nodemailer = require('nodemailer');

//send mail
exports.sendEmail=function(email,password)
{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'admin@augustasoftsol.com',
            pass: 'Augusta@12'
        }
    });
    transporter.sendMail({
        from: 'krishnakumar.vee@gmail.com',
        to: email,
        subject: 'hello krishna kumar',
        text:"Welcome to i800.   Your Password for i800 is "+ password
    });

};

// generate a random string for token
exports.randomString=function() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 6;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
};
