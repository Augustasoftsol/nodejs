/**
 * Created by balamurali on 07-07-2015.
 */

var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var departmentSchema=new Schema({
    departmentName:String,
    description:String,
    companyID:String
});

module.exports=mongoose.model('department',departmentSchema);
