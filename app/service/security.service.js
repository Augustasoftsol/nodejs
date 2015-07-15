/**
 * Created by balamurali on 09-07-2015.
 */

var pagination=require('mongoose-pagination');

//Models
var security = require('../models/securityModel'); //security Model




//get by : pageNo, pageSize, searchText, orderbyColumn, order
exports.Security=function(req,res) {

    var pageNo=req.body.pageNo,
        pageSize=req.body.pageSize,
        searchText=req.body.searchText,
        orderbyColumn=req.body.orderbyColumn,
        sortOrder=req.body.order;
    security
        .find({$or:[{label:new RegExp(searchText, 'i')},{description:new RegExp(searchText, 'i')}] })
        .paginate(pageNo, pageSize) // pagination (pageno, pagesize)
        .sort([[orderbyColumn, sortOrder]]) // sort [[field name , sort type (1 - asc, -1 - desc]]
        .exec(function (err, sec) {
            res.json({ devMessage: sec, userMessage:sec,success:true});
        });
};

//Security
exports.saveSecurity=function(req,res){
    if(req.body.securities.length>0) {
        security.collection.insert(req.body.securities, "", function (err, dbres) {
            if (err == null) {
                res.json({
                    devMessage: dbres,
                    userMessage: "Securities created successfully.",
                    success: true
                });
            }
            else {
                res.json({
                    devMessage: err,
                    userMessage: "Securities creation failed.",
                    success: false
                });
            }
        });
    }
    else
    {
        res.json({
            devMessage: "Securities not added.",
            userMessage: "Securities not added.",
            success: false
        });
    }
};

//CheckAgent Availability
exports.checkSecurity=function(req,res){
    if(req.body.securities.length>0) {
        var sec = req.body.securities[0];
        var exSecurity = security.findOne({label: sec.label}, function (err, secu) {
            if (secu) {
                res.json({
                    devMessage: "Security label already registerd.",
                    userMessage: "Security label already exist",
                    success: false
                });
            }
            else {
                res.json({
                    devMessage: "Security label availabe.",
                    userMessage: "Security label availabe.",
                    success: true
                });
            }

        });
    }
    else
    {
        res.json({
            devMessage: "Agents not added.",
            userMessage: "Agents not added.",
            success: false
        });
    }
};


