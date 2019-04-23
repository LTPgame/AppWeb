var express  = require('express');
var app      = express();                               
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var datalayer =require('./datalayer/datalayer');
var uuidv4 = require("uuid/v4");

var port= process.env.PORT || 8080;
var ip= "0.0.0.0";

require('./models/modelTask');

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.get("/",function(req,res){
    res.render('login.html');
});

app.get("/todolist",function(req,res){
    res.render('todolist.html');
});

app.get("/login",function(req,res){
    res.render('login.html');
});

app.get("/nouvcompte",function(req,res){
    res.render('nouvcompte.html');
});

app.post('/createUser', function(req, res){
    
    var usernouv = {
        username: req.body.username,
        mdp: req.body.mdp
    };
    datalayer.createUser(usernouv, function(err){
        if(err)
            res.send({success: false, username: usernouv.username, err: err})
        else {
            res.send({success: true, username: usernouv.username});
        }
    });
});

app.post('/createTask',function(req,res){
    var task = {
        _id: uuidv4(),
        username : req.body.username,
        text : req.body.text,
        done:false
    }
    datalayer.createTask(task,req.body.nomliste, function(err){
        if(err)
            res.send({success: false, task: task, err: err});
        else
            res.send({success: true, task: task});
    })
    
});

app.post('/createList',function(req,res){
    var liste= {
        nom: req.body.nom,
        username : req.body.username,
        listTask :req.body.listTask
    }
    datalayer.createList(liste, function(err){
        if(err)
            res.send({success: false, err: err});
        else
            res.send({success: true});
    })
    
});

app.post('/deleteList', function(req, res) {
    if(!req.body.nom) {
        res.send({success: false, err: "Pas de liste"});
    }
    else {
        datalayer.deleteList(req.body.nom,function (err){
            if(err)
                res.send({success: false, err: err});
            else
                res.send({success: true});
        });
    }
});

app.post('/updateList', (req, res) => {
    if(!req.body.nom) {
        res.send({success: false, err: "Pas de nom"});
    }
    else {
        var list = {
            nom: req.body.nom,
            username: req.body.username,
            listTask: req.body.listTask
        };
        datalayer.updateList(list, req.body.nommodif, function(err, doc){
            if(err)
                res.send({success: true, err: err});
            else
                res.send({success: true, list: list});
        });
    }
});

app.post('/updateAllTaskFromList', function(req, res){
    if(!req.body.list)
        res.send({success: false, err: "Pas de liste"});
    else {
        var list = req.body.list;
        datalayer.updateAllTaskFromList(list, function(taskSet){
            res.send({success: true, taskSet: taskSet});
        });
    }
});

app.post('/findUser', (req, res) => {
    if(!req.body.username || !req.body.mdp) {
        res.send({
            success: false,
            err: "Nom ou mdp vide"
        });
    }
    else {
        var usernouv = {
            username: req.body.username,
            mdp: req.body.mdp
        };
        datalayer.findUser(usernouv,function (err, success){
            if(success)
                res.send({success: true});
            else
                res.send({success: false, err: err});
        });
    }
});

app.post('/deleteTask', function(req, res) {
    if(!(req.body._id)) {
        res.send({success: false, err: "no id"});
    }
    else {
        datalayer.findTask(req.body._id, function(){
            datalayer.deleteTask(req.body._id,function (){
                res.send({success: true});
            });
        });
    }
});

app.post('/updateTask', function(req, res) {
    if(!req.body.text || !req.body._id) {
        res.send({success: false, err: "Pas de texte ou id"});
    }
    else {
        var task = {
            _id: req.body._id,
            text: req.body.text,
            done: req.body.done
        };
        datalayer.updateTask(task, function(){
            res.send({success: true, task: task});
        });
    }
});

app.post('/getAllTask/:username', function(req, res) {
    datalayer.getAllTask(req.params.username, function(err, taskSet) {
        if(err)
            res.send({success: false, err: err});
        else
            res.send({success: true, taskSet: taskSet});
    });
});

app.post('/getAllList/:username', function(req, res) {
    datalayer.getAllList(req.params.username, function(err, listSet){
        if(err)
            res.send({success: false, err: err});
        else
            res.send({success: true, listSet: listSet});
    });
});


app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


app.listen(port,ip,function(){
    console.log('Ecoute port 8080');
});
