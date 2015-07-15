/**
 * Created by vkrishna on 7/7/2015.
 */

var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var menuSchema=new Schema({
    menuName:String,
    companyId:[Schema.Types.ObjectId]
});
