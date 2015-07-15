/**
 * Created by vkrishna on 7/7/2015.
 */
var ObjectID = require('mongodb').ObjectID;
var department = require('../models/departmentModel');   //department Model
var menu = require('../models/menuModel');               //menu Model
exports.getDepartment = function (req, res) {
    department.find()
        .exec(function (err, comp) {
            res.json({devMessage: comp, userMessage: comp, success: true});
        });

};
exports.save = function (req, res) {
    menu.findOne({$and: [{menuName: req.body.menuName}, {companyId: req.body.companyId}]}, function (err, result) {
        if (result) {
            res.json({
                devMessage: "Menu name already registerd.",
                userMessage: "Menu name already exist",
                success: false
            });
        }
        else {
            var neMenu = new menu({
                menuName: req.body.menuName,
                companyId: new ObjectID(req.body.companyId)
            });
            neMenu.save(function (err, menus) {
                if (err) res.json({devMessage: err, userMessage: "Error occured", success: false});
                else {
                    res.json({devMessage: menus, userMessage: "Menu created successfully", success: true})
                }
                ;
            });

        }
    })
};
