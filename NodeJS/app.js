"use strict";

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var md5 = crypto.createHash('md5');
var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


//这里使用mongoose连接Mongodb
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
//！！！回调！！！
//若连接成功回调此函数，打印出连接成功
mongoose.connection.once('open', function (){
    console.log('Connected to mongodb');
});

const baseURL = 'http://192.168.43.17:8000/images/';

const Schema = mongoose.Schema;
//user
const userSchema = new Schema({
    name: {type: String, require: true},
    password: {type: String, require: true},
    score: {type: Number, default: 0},
    date: {type: Date, default: Date.now}
});
const User = mongoose.model('user', userSchema);

//question
const questionSchema = new Schema({
    id: {type: Number, require: true},
    url: {type: String, require: true},
    answer: {type: Number, require: true}
});
const Question = mongoose.model('question', questionSchema);
// var questionList = [
//     {id: 1, url: baseURL + "1-1.jpg", answer: 1},
//     {id: 2, url: baseURL + "1-2.jpg", answer: 1},
//     {id: 3, url: baseURL + "1-3.jpg", answer: 1},
//     {id: 4, url: baseURL + "1-4.jpg", answer: 1},
//     {id: 5, url: baseURL + "1-5.jpg", answer: 1},
//     {id: 6, url: baseURL + "1-6.jpg", answer: 1},
//     {id: 7, url: baseURL + "1-7.jpg", answer: 1},
//     {id: 8, url: baseURL + "1-8.jpg", answer: 1},
//     {id: 9, url: baseURL + "1-9.jpg", answer: 1},
//     {id: 10, url: baseURL + "1-10.jpg", answer: 1},
//     {id: 11, url: baseURL + "2-1.jpg", answer: 2},
//     {id: 12, url: baseURL + "2-2.jpg", answer: 2},
//     {id: 13, url: baseURL + "2-3.jpg", answer: 2},
//     {id: 14, url: baseURL + "2-4.jpg", answer: 2},
//     {id: 15, url: baseURL + "2-5.jpg", answer: 2},
//     {id: 16, url: baseURL + "2-6.jpg", answer: 2},
//     {id: 17, url: baseURL + "2-7.jpg", answer: 2},
//     {id: 18, url: baseURL + "2-8.jpg", answer: 2},
//     {id: 19, url: baseURL + "2-9.jpg", answer: 2},
//     {id: 20, url: baseURL + "2-10.jpg", answer: 2},
//     {id: 21, url: baseURL + "3-1.jpg", answer: 3},
//     {id: 22, url: baseURL + "3-2.jpg", answer: 3},
//     {id: 23, url: baseURL + "3-3.jpg", answer: 3},
//     {id: 24, url: baseURL + "3-4.jpg", answer: 3},
//     {id: 25, url: baseURL + "3-5.jpg", answer: 3},
//     {id: 26, url: baseURL + "3-6.jpg", answer: 3},
//     {id: 27, url: baseURL + "3-7.jpg", answer: 3},
//     {id: 28, url: baseURL + "3-8.jpg", answer: 3},
//     {id: 29, url: baseURL + "3-9.jpg", answer: 3},
//     {id: 30, url: baseURL + "3-10.jpg", answer: 3},
//     {id: 31, url: baseURL + "4-1.jpg", answer: 4},
//     {id: 32, url: baseURL + "4-2.jpg", answer: 4},
//     {id: 33, url: baseURL + "4-3.jpg", answer: 4},
//     {id: 34, url: baseURL + "4-4.jpg", answer: 4},
//     {id: 35, url: baseURL + "4-5.jpg", answer: 4},
//     {id: 36, url: baseURL + "4-6.jpg", answer: 4},
//     {id: 37, url: baseURL + "4-7.jpg", answer: 4},
//     {id: 38, url: baseURL + "4-8.jpg", answer: 4},
//     {id: 39, url: baseURL + "4-9.jpg", answer: 4},
//     {id: 40, url: baseURL + "4-10.jpg", answer: 4},
// ]
// Question.insertMany(questionList, (err, res) => {
//     console.log('success');
// });




// var admin = new User({
//     name: 'admin',
//     password: 1
// });
// admin.save(function (err){
//     if(err){
//         throw err;
//     }else{
//         console.log('user init success');
//     }
// });
// User.findOne({name: 'admin'}, function(err, user){
//     if(err){
//         throw err;
//     }else{
//         console.log(user);
//     }
// });
// User.updateOne({name: '10'}, {'$set': {score: 26}}, function (err, res){
//     console.log(res);
// });
// User.updateOne({name: '6'}, {'$set': {score: 22}}, function (err, res){
//     console.log(res);
// });


// app.get('/', function (req, res){
//     res.type("json").json({"msg": "Hello World!"});
// });
// app.get('/hello/:num', function (req, res){
//     res.type('text').send("Hello " + req.params.num + "!");
// });
// app.get('/states/:state/cities/:city', function (req, res){
//     res.type("text").send("state: " + req.params.state + ", city: " + req.params.city);
// });
// app.get('/cityInfo', function (req, res){
//     res.type('text').send("state: " + req.query.state + ", city: " + req.query.city);
// });



app.post('/checkUser', function (req, res){
    console.log('check user: ', req.body);
    var token = req.body.token;
    //！！！回调函数！！！
    //当token验证通过后，回调此函数
    jwt.verify(token, 'viktor', function (err, decode){
        if(err){
            res.type('text').send('fail');
            console.log(err);
        }else{
            res.type('text').send(decode);
            console.log(decode);
        }
    });
});
app.post('/loginByToken', function (req, res){
    console.log('login request: ', req.body);
    //！！！回调！！！
    //当用户查询完后回调此函数
    User.find({
        name: req.body.name
    }, function (err, user){
        if(err){
            res.type('text').send('nothing');
            console.log('login fail');
        }else{
            if(user.length == 0){
                res.type('text').send('NotExist');
                console.log('login fail');
            }
            else if(user[0].password == req.body.password){
                var content = {name: user.name, password: user.password};
                var token = jwt.sign(content, 'viktor', {
                    expiresIn: 60 * 60 * 1 
                });
                res.type('json').json({msg: 'success', token: token});
                console.log('login success');
            }else{
                res.type('text').send('fail');
                console.log('login fail');
            }
        }
    });
});
app.post('/login', function (req, res){
    console.log('login request: ', req.body);
    //！！！回调！！！
    //当用户查询完后回调此函数
    User.find({
        name: req.body.name
    }, function (err, user){
        if(err){
            res.type('text').send('nothing');
            console.log('login fail');
        }else{
            if(user.length == 0){
                res.type('text').send('NotExist');
                console.log('login fail');
            }
            else if(user[0].password == req.body.password){
                res.type('text').send('success');
                console.log('login success');
            }else{
                res.type('text').send('fail');
                console.log('login fail');
            }
        }
    });
});
app.post('/register', function (req, res){
    console.log('register request: ', req.body);
    var one = new User({
        name: req.body.name,
        password: req.body.password
    });
    //！！！回调！！！
    //当用户保存后回调此函数
    one.save(function (err){
        if(err){
            res.type('text').send('fail');
            console.log('register fail');
        }else{
            res.type('text').send('success');
            console.log('register success');
        }
    });
});
app.post('/updateScore', function (req, res){
    console.log('user score update: ', req.body);
    var one = '';
    //！！！Promise！！！
    //这里使用Promise主要是保证先将用户查询出来后（结果已经获得后）再去更新该用户的分数信息
    //不用的话无法保证执行顺序，容易造成用户还没查询出来就拿着空数据去更新用户的分数
    new Promise(function (resolve, reject){
        User.findOne({name: req.body.name}, function (err, user){
            one = user;
            resolve();
        });
    }).then(function (result){
        User.updateOne({name: one.name}, {'$set': {score: one.score + req.body.delta}}, function (err, doc){
            res.type('text').send('success');
            console.log('update success');
        });
    }).catch(function(err){
        console.log(err);
        res.type('text').send('fail');
        console.log('update fail');
    });
});
app.get('/rank', function (req, res){
    console.log('get rank info: ', req.body);
    //！！！回调！！！
    //当用户查询出后回调此函数
    User.find({}, function (err, users){
        if(err){
            res.type('text').send('fail');
            console.log('get rank info fail');
        }else{
            res.type('json').json(users);
            console.log('get rank info success');
        }
    });
});
app.get('/question/:num', function (req, res){
    console.log('get question info: ', req.params);
    //！！！回调！！！
    //当题库查询出来后，回调此函数
    Question.find({}, function (err, questions){
        if(err){
            res.type('text').send('fail');
            console.log('load question fail');
        }else{
            var result = [];
            for(var i = 0;i < req.params.num;i++){
                var length = questions.length
                var index = Math.floor(Math.random() * length);
                result.push(questions[index]);
                questions.splice(index, 1);
            }
            res.type('json').json(result);
            console.log('get question info success');
        }
    });
});
// var fs = require('fs');
// fs.readFile('./package.json', 'utf8', function(err, contents){
//     console.log(contents);
// });
const PORT = process.env.PORT || 8000;
//！！！回调！！！
//当监听成功开启后回调此函数
app.listen(PORT, function(){
    console.log('Example app listening on port %d!', PORT);
});