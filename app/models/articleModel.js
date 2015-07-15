/**
 * Created by vkrishna on 7/8/2015.
 */


var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var articleSchema=new Schema({
    Name:String,
    image:String
});

module.exports=mongoose.model('article',articleSchema);
