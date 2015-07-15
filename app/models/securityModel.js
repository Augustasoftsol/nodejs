/**
 * Created by balamurali on 09-07-2015.
 */

var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var securitySchema=new Schema({
    label:String,
    inputType:String,
    mandatory:Boolean,
    description:String,
    apiParameterName:String
});

module.exports=mongoose.model('security',securitySchema);

