/**
 * Created by vkrishna on 7/9/2015.
 */



var survey = require('../models/surveyModel');   //survey Model
var ObjectID = require('mongodb').ObjectID;
exports.survey = function (req, res) {

    if (req.body.a.surveyList.length > 0) {
        survey.collection.insert(req.body.a.surveyList, function (err, suc) {
            if (suc) {
                res.sendData({devMessage: suc, userMessage: 'Survey saved successfully', success: true});
            }
            else {
                res.json({
                    devMessage: errorHandler.getErrorMessage(err),
                    userMessage: 'Survey not saved',
                    success: false
                });
            }
        });
    }
    else {
        res.sendData({a:{devMessage: 'Survey list is empty.', userMessage: 'Survey list is empty to save', success: false}});
    }

};

exports.getSurvey = function (req, res) {
    console.log(req.body);
    var pageNo = req.body.surveys.pageNo,
        pageSize = req.body.surveys.pageSize,
        searchText = req.body.surveys.searchText,
        orderbyColumn = req.body.surveys.orderbyColumn,
        sortOrder = req.body.surveys.order;
    survey
        .find({$or: [{question: new RegExp(searchText, 'i')}, {inputType: new RegExp(searchText, 'i')}, {departmentId: req.body.surveys.departmentId}]})
        .paginate(pageNo, pageSize) // pagination (pageno, pagesize)
        .sort([[orderbyColumn, sortOrder]]) // sort [[field name , sort type (1 - asc, -1 - desc]]
        .exec(function (err, dept) {
            if (dept) {
                var data = {devMessage: dept, userMessage: dept, success: true};
             res.sendData(data);
            }
            else
                res.sendData({
                    devMessage: err,
                    userMessage: 'Error occurred',
                    success: false
                });
        });
};
/* Check the question for department to avoid the duplicates */
exports.checkQuestion = function (req, res) {
    survey.findOne({question: req.body.question}, {departmentId: new ObjectID(req.body.departmentId)}, function (err, survey) {
        if (survey) {
            res.json({
                devMessage: 'Question already added to this department',
                userMessage: 'Question already added to this department',
                success: false
            });
        }
        else {
            res.json({
                devMessage: 'Success',
                userMessage: 'Success',
                success: true
            });
        }
    });
};
