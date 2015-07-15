/**
 * Created by balamurali on 07-07-2015.
 */

var pagination = require('mongoose-pagination');

//Models
var department = require('../models/departmentModel'); //company Model


//get by : pageNo, pageSize, searchText, orderbyColumn, order
exports.Department = function (req, res) {

    var pageNo = req.body.pageNo,
        pageSize = req.body.pageSize,
        searchText = req.body.searchText,
        orderbyColumn = req.body.orderbyColumn,
        sortOrder = req.body.order;
    department
        .find({$or: [{departmentName: new RegExp(searchText, 'i')}, {companyID: new RegExp(searchText, 'i')}]})
        .paginate(pageNo, pageSize) // pagination (pageno, pagesize)
        .sort([[orderbyColumn, sortOrder]]) // sort [[field name , sort type (1 - asc, -1 - desc]]
        .exec(function (err, dept) {
            res.json({devMessage: dept, userMessage: dept, success: true});
        });
};

//Company
exports.saveDepartment = function (req, res) {
    //var deptResponse = [];
    if (req.body.departments.length > 0) {
        department.collection.insert(req.body.departments, "", function (err, dbres) {
            if (err == null) {
                res.json({
                    devMessage: dbres,
                    userMessage: "Departments created successfully.",
                    success: true
                });
            }
            else {
                res.json({
                    devMessage: err,
                    userMessage: "Departments creation failed.",
                    success: false
                });
            }
        });
    }
    else {
        res.json({
            devMessage: "Departments not added.",
            userMessage: "Departments not added.",
            success: false
        });
    }
};

//CheckDepartment Availability
exports.checkDepartment = function (req, res) {
    if (req.body.departments.length > 0) {
        var age = req.body.departments[0];
        var exDepartment = department.findOne({departmentName: age.departmentName}, function (err, dept) {
            if (dept) {
                res.json({
                    devMessage: "Department name already registerd.",
                    userMessage: "Department name already exist",
                    success: false
                });
            }
            else {
                res.json({
                    devMessage: "Department name availabe.",
                    userMessage: "Department name availabe.",
                    success: true
                });
            }

        });
    }
    else {
        res.json({
            devMessage: "Agents not added.",
            userMessage: "Agents not added.",
            success: false
        });
    }
};
