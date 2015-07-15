/**
 * Created by vkrishna on 7/7/2015.
 */


module.exports = function (app, apiRoutes) {
    // Route config for authentication
    var authservice = require('../service/auth.service');
    app.route('/signup').post(authservice.signup);
    app.route('/validate').post(authservice.validate);

    app.route('/signin').post(authservice.signin);
    app.route('/forgot').post(authservice.forgot);
    app.route('/reset').post(authservice.reset);
    app.route('/changePassword').post(apiRoutes, authservice.changePassword);


    // Route config for company
    var companyservice = require('../service/company.service.js');
    app.route('/Company').get(companyservice.Company)
        .post(companyservice.saveCompany);
    app.route('/upload').post(companyservice.fileupload);

    // Route config for department
    var departmentservice = require('../service/department.service.js');
    app.route('/Department').get(departmentservice.Department)
        .post(departmentservice.saveDepartment);
    app.route('/CheckDepartment').post(departmentservice.checkDepartment);

    // Route config for menu
    var menuservice = require('../service/menu.service.js');
    app.route('/getDepartment').get(menuservice.getDepartment);
    app.route('/menu').post(menuservice.save);


    // Route config for agent
    var agentservice = require('../service/agent.service.js');
    app.route('/Agent').get(agentservice.Agent)
        .post(agentservice.saveAgent);
    app.route('/CheckAgent').post(agentservice.checkAgent);


    //Route config for survey
    var surveyservice = require('../service/survey.service.js');
    app.route('/survey').get(surveyservice.getSurvey)
        .post(surveyservice.survey);
    app.route('/checkQuestion').post(surveyservice.checkQuestion);

    //Route config for security
    var securityservice = require('../service/security.service.js');
    app.route('/Security').get(securityservice.Security)
        .post(securityservice.saveSecurity);
    app.route('/CheckSecurity').post(securityservice.checkSecurity);
}

