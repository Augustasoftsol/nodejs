/**
 * Created by vkrishna on 6/29/2015.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto');

var Schema = mongoose.Schema;
var registerSchema = new Schema({
    companyName : String,
    companyPhone: String,
    description: String,
    logoPath:String,
    contactFirstName:String,
    contactLastName:String,
    contactEmail : String,
    contactPhone : String,
    address:String,
    city:String,
    state:String,
    country:String,
    zipcode:String,

    username:String,
    password:String,
    active:Boolean,

    emailConfirmToken: String,
    emailConfirmExpires:Date,

    resetPasswordToken: String,
    resetPasswordExpires:Date

});

registerSchema.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.password === pwd );
};

registerSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};
/**
 * Create instance method for authenticating user
 */
registerSchema.methods.authenticate = function(password) {
    return this.password === password;
};
var model=module.exports = mongoose.model('register', registerSchema);
/*registerSchema.pre('save', function (next) {
    var self = this;
    model.find({companyName : self.companyName}, function (err, docs) {
        if (!docs.length){
            model.find({contactEmail : self.contactEmail}, function (err, docs) {
                if (!docs.length){
                    model.find({username : self.username}, function (err, docs) {
                        if (!docs.length){
                            next();
                        }else{
                            console.log('username exists: ',self.username);
                            next(new Error("username exists!"));
                        }
                    });
                }else{
                    console.log('Email already exists: ',self.contactEmail);
                    next(new Error("Email already exists!"));
                }
            });


        }else{
            console.log('Company name exists: ',self.companyName);
            next(new Error("Company name exists!"));
        }
    });
}) ;*/


