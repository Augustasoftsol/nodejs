/**
 * Created by vkrishna on 6/30/2015.
 */



var pagination=require('mongoose-pagination');

//Models
var company = require('../models/companyModel'); //company Model

var fs = require('fs');



//get by : pageNo, pageSize, searchText, orderbyColumn, order
exports.Company=function(req,res) {

    var pageNo=req.body.pageNo,
        pageSize=req.body.pageSize,
        searchText=req.body.searchText,
        orderbyColumn=req.body.orderbyColumn,
        sortOrder=req.body.order;
    company
        .find({$or:[{companyName:new RegExp(searchText, 'i')},{phone:new RegExp(searchText, 'i')}] })
        .paginate(pageNo, pageSize) // pagination (pageno, pagesize)
        .sort([[orderbyColumn, sortOrder]]) // sort [[field name , sort type (1 - asc, -1 - desc]]
        .exec(function (err, comp) {
            res.json({ devMessage: comp, userMessage:comp,success:true});
        });
};

//Company
exports.saveCompany=function(req,res){

    var exCompany=company.findOne({companyName:req.body.companyName}, function (err,comp) {
        if (comp) {
            res.json({ devMessage: "Company name already registerd.", userMessage:"Company name already exist",success:false });
        }
        else {
            var newCompany=new company({
                companyName:req.body.companyName,
                phone:req.body.phone
            });
            newCompany.save(function(err,comp){
                if (err) res.json({ devMessage: err, userMessage:"Error occured",success:false });
                else{
                    res.json({ devMessage: comp, userMessage:"Company created successfully",success:true})};
            });

        }
    })


};

exports.fileupload=function(req,res)
{

    var file = req.files.myFile;
    console.log(file.name);
    console.log(file.type);
    console.log(file.path);
    console.log(req.body);


    var article1 = new article({
    name:req.body.name
});
 //   article.user = req.user;

    fs.readFile(file.path, function (err,original_data) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        // save image in db as base64 encoded - this limits the image size
        // to there should be size checks here and in client
        var base64Image = original_data.toString('base64');
        console.log(base64Image);
        fs.unlink(file.path, function (err) {
            if (err)
            {
                console.log('failed to delete ' + file.path);
            }
            else{
                console.log('successfully deleted ' + file.path);
            }
        });
        article1.image = base64Image;

        var base64Data = base64Image.replace(/^data:image\/png;base64,/, "");

       fs.writeFile("out.png", base64Data, 'base64', function(err) {
            console.log(err);
        });


        article1.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(article);
            }
        });
    });
};