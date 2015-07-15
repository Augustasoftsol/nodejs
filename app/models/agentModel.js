/**
 * Created by balamurali on 07-07-2015.
 */

var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var agentSchema=new Schema({
    firstName:String,
    lastName:String,
    deskphoneNumber:String,
    email:String,
    Active:Boolean,
    softPhone:Boolean,
    departmentID:String
});

module.exports=mongoose.model('agent',agentSchema);
