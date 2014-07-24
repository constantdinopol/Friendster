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
    dateOfBirth:{type:String},
    school:{type:String},
    profilePic:{type:String},
    post:[String]

});

app.use(bodyParser());

// Create a instance of collection
var ExpressUsers = mongoose.model('FriendsterUsers', IntelliInfoSchema);


app.get('/user', function(req, res) {
    ExpressUsers.find({_id:req.session.userData},{}).limit(0).exec(function(err, result) {
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

/*app.put('/user/:id', function(req, res) {
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
});*/

app.put('/user', function(req, res) {
    // Update user information
    if(req.session.userData == undefined){
        res.json({status:0});
    }else {
         ExpressUsers.update({_id:req.session.userData},req.body,function(err,result){
             if (err) {
                 res.json({status:0});
             }else{
                 res.json({status:1});
             }
         });
    }
});

app.post('/logout', function(req, res) {
    req.session.userData = undefined;
    res.json({status:1});

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
            req.session.userData = result[0]._id;
            if(result != undefined && result != ""){
                ExpressUsers.update({_id:req.session.userData},{sessionId:1},function(err,updatedResult){
                    if (err) {
                        res.json({status:0});
                    }else{
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

app.post('/findFriend', function(req, res) {
    var searchData = req.body.value;
    ExpressUsers.find({firstName:new RegExp(searchData, 'i'), _id:{$ne:req.session.userData}}).limit(0).exec(function(err, result) {
        if (err) {
            res.json({status:0});
        }else{
            console.log('result' + result);
            var findData = {
                status:1,
                friends:result
            };
            res.json(findData);
        }
    });
});

app.post('/post', function(req, res) {
    var message = req.body.post;

    var hh = {};
    hh.post = [];
    hh.post.push(message);

    ExpressUsers.update({_id:req.session.userData},{$push:{post:message}},function(err,result){
        if (err) {
            res.json({status:0});
        }else{
            res.json({status:1});
        }
    });
});

app.post('/sendFriendRequest', function(req, res) {
    var senderId = req.body.id;
    var sendData = {
        id:req.session.userData,
        status:'new',
        name:req.body.senderName
    };
    ExpressUsers.update({_id:senderId},{$addToSet:{friends:sendData}},function(err,result){
        if (err) {
            res.json({status:0});
        }else{
            sendData = {
                id:senderId,
                status:'send',
                name:req.body.receiverName
            };

ExpressUsers.update({_id:req.session.userData},{$addToSet:{friends:sendData}},function(err,result){
                if (err) {
                    res.json({status:0});
                }else{
                    res.json({status:1});
                }
            });
        }
    });
});

app.post('/respondFriendRequest', function(req, res) {
    var senderId = req.body.id;
    var status = req.body.status;

    ExpressUsers.update({_id:senderId, 'friends.id':req.session.userData},{$set: {'friends.$.status':status}},function(err,result){
        if (err) {
            res.json({status:0});
        }else{

            ExpressUsers.update({_id:req.session.userData, 'friends.id':senderId},{$set: {'friends.$.status':status}},function(err,result){
                if (err) {
                    res.json({status:0});
                }else{
                    res.json({status:1});
                }
            });
        }
    });
});

// Handle page routing
app.get('/', function(req, res){
    res.redirect('index.html');
});
app.get('/index', function(req, res){
    res.redirect('index.html');
});

app.get('/UserProfile', function(req, res){
    if(req.session.userData){
        res.redirect('UserProfile.html');
    }else{
        res.redirect('index.html');
    }
});


http.createServer(app).listen(3002);
