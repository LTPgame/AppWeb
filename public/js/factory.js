//factory

todoList.factory('todoFactory',['$http', function($http){

    var services = {

        createUser: function(username, mdp, cb) {
            
            var req = {
                username: username,
                mdp: mdp
            };
            $http.post('/createUser', req)
                .then(function(res) {
                    console.log("aaaa")
                    cb(res.data);
                });
        },
  
        findUser: function(username, mdp, cb) {
            var req = {
                username: username,
                mdp: mdp
            };
            $http.post('/findUser', req)
                .then( function(res) {
                    console.log(res);
                    cb(res.data.success);
                });
        },

        createTask:function(username,text , nomliste, cb){
            var req = {
                nomliste:nomliste,
                username: username,
                text: text
            };
            $http.post('/createTask', req).then( function(res){
                cb(res);
            });
        },


        deleteTask: function(idtask, cb) {
            var req = {
                _id: idtask
            };
            $http.post('/deleteTask', req)
                .then(function(res) {
                    cb(res);
                });
        },

        updateTask: function(task, cb) {
            var req = {
                _id: task._id,
                text: task.text,
                done: task.done
            };
            $http.post('/updateTask', req)
                .then( function(res) {
                    cb(res);
                });
        },

        createList: function(list, cb) {
            var req = {
                nom: list.nom,
                username: list.username,
                listTask: list.listTask
            };
            $http.post('/createList', req)
                .then(function(res) {
                    cb(res);
                });
        },

        deleteList: function(nom, cb) {
            var req = {
                nom: nom
            };
            $http.post('/deleteList', req)
                .then( function(res){
                    cb(res);
                });
        },

        updateList: function(list, nom, cb){
            var req = {
                nommodif: nom,
                nom: list.nom,
                username: list.username,
                listTask: list.listTask
            };
            $http.post('/updateList', req)
                .then(function(res) {
                    cb(res);
                });
        },

        getAllTask:function (username, cb) {
            $http.post('/getAllTask/' + username)
                .then(function(res){
                    if(res.data.success)
                        cb(res.data.taskSet);
                    else
                        cb([]);
                });
        },
  
        getAllList:function(username, cb) {
            $http.post('/getAllList/' + username)
                .then(function(res) {
                    if(res.data.success)
                        cb(res.data.listSet)
                    else
                        cb([])
                });
        },

        updateAllTaskFromList: function(list, cb) {
            var req = {
                list: list
            };
            $http.post('/updateAllTaskFromList', req)
                .then(function(res) {
                    cb(res);
                });
        }
  

    };

    return services;

   


}]);