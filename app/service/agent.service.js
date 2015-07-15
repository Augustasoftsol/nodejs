/**
 * Created by balamurali on 07-07-2015.
 */

var pagination = require('mongoose-pagination');

//Models
var agent = require('../models/agentModel'); //company Model


//get by : pageNo, pageSize, searchText, orderbyColumn, order
exports.Agent = function (req, res) {

    var pageNo = req.body.pageNo,
        pageSize = req.body.pageSize,
        searchText = req.body.searchText,
        orderbyColumn = req.body.orderbyColumn,
        sortOrder = req.body.order;
    agent
        .find({$or: [{firstName: new RegExp(searchText, 'i')}, {lastName: new RegExp(searchText, 'i')}]})
        .paginate(pageNo, pageSize) // pagination (pageno, pagesize)
        .sort([[orderbyColumn, sortOrder]]) // sort [[field name , sort type (1 - asc, -1 - desc]]
        .exec(function (err, age) {
            res.json({devMessage: age, userMessage: age, success: true});
        });
};

//Agent
exports.saveAgent = function (req, res) {
    if (req.body.agents.length > 0) {
        agent.collection.insert(req.body.agents, "", function (err, dbres) {
            if (err == null) {
                res.json({
                    devMessage: dbres,
                    userMessage: "Agents created successfully.",
                    success: true
                });
            }
            else {
                res.json({
                    devMessage: err,
                    userMessage: "Agents creation failed.",
                    success: false
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

//CheckAgent Availability
exports.checkAgent = function (req, res) {
    if (req.body.agents.length > 0) {
        var age = req.body.agents[0];
        var exAgent = agent.findOne({firstName: age.firstName}, function (err, agnt) {
            if (agnt) {
                res.json({
                    devMessage: "Agent name already registerd.",
                    userMessage: "Agent name already exist",
                    success: false
                });
            }
            else {
                res.json({
                    devMessage: "Agent name availabe.",
                    userMessage: "Agent name availabe.",
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

