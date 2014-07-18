/**
 * Created by intelligrape on 13/7/14.
 */

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var http = require("http");
var session = require('express-session');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname));
app.use(session({secret:'rubi.saini@intelligrape.com'}));
//Include mongoose into project
var mongoose = require('mongoose');
var userData;

//Create a data base
var URLString ='mongodb://localhost/FriendsterDB';

// trace the status of program
console.log('Node JS server started....');

//Connect to data base
mongoose.connect(URLString,function(err){
    if(err){
        console.log('Error' + err);
    }else {
        console.log('successfully connect');
    }
});
// Create schema for intelliGrape Emp
var IntelliInfoSchema = new mongoose.Schema({
   // id:{type:String, index:{unique:true}},  // set constraints
    firstName:{type:String},
    lastName:{type:String},
    phone:{type:String},
    email:{type:String},
    password:{type:String},
    friends:{type:Array},
    pics:{type:Array},
    homeTown:{type:String},
    workedAt:{type:String},
    sessionId:{type:Number},
    gender:{type:String},
    dateOfBirth:{type:String}

});

// Create a instance of collection
var ExpressUsers = mongoose.model('FriendsterUsers', IntelliInfoSchema);
app.get('/user', function(req, res) {
    ExpressUsers.find({_id:userData},{}).limit(0).exec(function(err, result) {
        if (err) {
            //callback(err);
            res.json({status:0});
        }else{
            res.send(result);
        }
    });
});

app.post('/user', function(req, res) {
    /*var uId = req.body.uId;
    var uName = req.body.uName;
    var userData = {
        id:uId,
        name:uName
    };*/


    console.log('input param ' + req.body);
    new ExpressUsers(req.body).save(function (err) {
        if (err) {
            res.send('Some error occured');
        } else {
            res.send('Add a new user');
        }
    });
});

app.put('/user/:id', function(req, res) {
    // Update user information
    console.log('user id  ' + req.param.id);
    if(req.param('id') == undefined){
        res.send('Missing user id');
    }else {
        var uName = req.body.uName;
        ExpressUsers.update({id:req.param('id')},{name:uName},function(err,result){
            if (err) {
                res.send('Some problem occured at the time of update');
            }else
                res.send('Update record ' + result);
        });
    }
});

app.post('/logout', function(req, res) {
    console.log("logout method ------" +userData);

   res.json({user:userData});
   /* // Update user information
    console.log('user id  ' + req.param.id);
    if(req.param('id') == undefined){
        res.send('Missing user id');
    }else {
        ExpressUsers.update({id:req.param('id')},{sessionId:0},function(err,result){
            if (err) {
                res.json({status:0});
            }else{
                res.json({status:2});
            }
        });
    }*/
});

app.put('/validate', function(req, res) {
    // Update user information
    if(req.param('id') == undefined){
        res.json({status:0});
    }else {
        ExpressUsers.update({id:req.param('id')},{sessionId:0},function(err,result){
            if (err) {
                res.json({status:0});
            }else{
                res.json({status:2});
            }
        });
    }
});


app.delete('/user/:id', function(req, res) {
    // Update user information
    if(req.params.id == undefined){
        res.send('Missing user id');
    }else {
        ExpressUsers.remove({id:req.params.id}, function(err, result) {
            if (err) {
                res.send('Error while remove  data from DB..' + err);
            }
            else {
                res.send('Remove successfully');
            }
        });
    }
});

app.post('/login', function(req, res) {
    ExpressUsers.find({'email': req.body.userName, 'password': req.body.password}, {}).limit(0).exec(function (err, result) {
      if (err) {
            res.json({status:0});
        }
       else{
            userData = result[0]._id;
            if(result != undefined && result != ""){
                ExpressUsers.update({_id:userData},{sessionId:1},function(err,updatedResult){
                    if (err) {
                        console.log('Update session variable error  ' + err);
                        res.json({status:0});
                    }else{
                        console.log('Update session variable  ' + userData + '  ' + result);
                       // req.session.id = userId;
                        res.json({status:1});
                    }
                });
            }else{
                res.json({status:0});
            }
        }
    });
});

app.post('/submit', function(req, res) {

    new ExpressUsers(req.body).save(function (err) {
        if (err) {
            res.json({status:0});
        } else {
            res.json({status:1});
        }
    });

});


app.post('/session', function(req, res) {

    new ExpressUsers(req.body).save(function (err) {
        if (err) {
            res.json({status:0});
        } else {
            res.json({status:1});
        }
    });

});

http.createServer(app).listen(3000);
