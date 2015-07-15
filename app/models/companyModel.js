/**
 * Created by vkrishna on 6/30/2015.
 */

var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var companySchema=new Schema({
   companyName:String,
    phone:String
});

module.exports=mongoose.model('company',companySchema);



