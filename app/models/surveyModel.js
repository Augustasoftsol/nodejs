/**
 * Created by vkrishna on 7/9/2015.
 */

var mongoose = require('mongoose');


var Schema = mongoose.Schema;
var surveySchema = new Schema
({
    id:Number,
    question: String,
    inputType: String,
    departmentId: Number,
    Active: Boolean
});

module.exports = mongoose.model('survey', surveySchema);
