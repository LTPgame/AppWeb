var mongoose = require('mongoose');
var tachemodele= require('../models/modelTask');
var usermodele=require('../models/modelUser');
var listmodele=require('../models/modelList');

mongoose.connect("mongodb+srv://user1:mdpuser1@cluster0-t4qee.gcp.mongodb.net/test?retryWrites=true", {useNewUrlParser: true}, function(err){
    if(err)
        throw err;
    else
        console.log('mongo connected');
});


mongoose.set('useCreateIndex', true);
var data={
    //creer tache
    createTask: function(task, nomliste, cb){
        var tache =new tachemodele({
            _id: task._id,
            text : task.text,
            username : task.username,
            done:task.done
           
        })
        tache.save(function (err) {
            if (err) cb(err);
            else{
                listmodele.findOne({'nom':nomliste}, function(err, liste){
                    if(err) cb(err);
                    else{
                        var listnouv;
                        listnouv = liste;
                        listnouv.listTask.push(task._id);
                        listmodele.findOneAndUpdate({'nom': nomliste}, listnouv, function(err,doc){
                            cb(err);
                        })
                    }
                })
            }

        });
    },

    deleteTask: function(id,cb){
        tachemodele.findByIdAndRemove(id, function (err,task) {
            if (err) throw err;
            else cb(task);
          });
    },

    findTask: function(taskid, cb)  {
        tachemodele.findById(taskid, function(err, task) {
            if (err)
                throw err;
            else {
                if (task != null)
                    cb();
            }
        });
    },

    updateTask : function(task, cb){
        
        tachemodele.findByIdAndUpdate(task._id, task, function(err,task){
            if(err)
                throw(err);
            cb(task);
        });
    },



    updateAllTaskFromList: function(list, cb){
        tachemodele.find({ 'username': list.username }, function(err,taskSet){
           var tasksetnouv= [];
           for(var i = 0; i<taskSet.length;i++){
               if(list.listTask.includes(taskSet[i]._id)) tasksetnouv.push(taskSet[i]);
           }
           cb(tasksetnouv);
        });
    },

    createList: function(list,  cb){
        var liste =new listmodele({
            nom: list.nom,
            username : list.username,
            listTask: list.listTask
           
        })
        liste.save(function(err) {
            cb(err);
        });
    },

    deleteList: function(nom, cb) {
        listmodele.findOneAndRemove({ 'nom': nom }, function(err, doc)  {
            cb(err, doc);
        });
    },

    updateList: function(list, nom, cb) {
        listmodele.findOneAndUpdate({ 'nom': nom }, list,function(err, doc) {
            cb(err, doc);
        });
    },

    getAllTask: function(username, cb) {
        tachemodele.find({ 'username': username }, function(err, taskSet) {
            cb(err, taskSet);
        });
    },

    getAllList: function(username, cb) {
        listmodele.find({ 'username': username }, function(err, listSet) {
            if (err)
                cb(err, []);
            else {
                cb(err, listSet);
            }
        });
    },

    createUser: function(user, cb) {
        var usernouv = new usermodele({
            username: user.username,
            mdp: user.mdp
        });
        usernouv.save(function(err)  {
            cb(err);
        });
    },

    findUser: function(user, cb)  {
        var usercherche = {
            username: user.username,
            mdp: user.mdp
        };
        usermodele.findOne(usercherche, function(err, userSet) {
            if (err)
                cb(err, false);
            else {
                if (userSet == null)
                    cb(err, false);
                else
                    cb(err, true);
            }
        });
    }


}

module.exports = data;