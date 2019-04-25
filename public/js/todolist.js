var todoList = angular.module('todoList', []);



//controller todo
todoList.controller('todoController',['$scope', 'todoFactory',function($scope, todoFactory){
    $scope.taskSet=[];
    $scope.listSet=[];

    $scope.createTask=function(ilist){
        var user = window.sessionStorage.getItem('username');
        if(user == null || user == 'null')
            return;
        todoFactory.createTask(user,"Nouvelle tâche",$scope.listSet[ilist].nom, function(res){
            console.log(res);
            if(res){ console.log("Nouvelle tâche ajouté");
             $scope.reload();
            }
        } );
    };

    $scope.createList= function(){
        var user = window.sessionStorage.getItem('username');
        
        if($scope.listtext == "" || $scope.listtext == undefined || user == null || user == 'null')
            return;
        var list = {
            nom: $scope.listtext,
            username: user,
            listTask: []
        };
        todoFactory.createList(list, function(res){
            if(res.data.success)
                console.log('Liste ajoutée');
            else
                console.log('Erreur ajout liste');
            $scope.listtext = "";
            $scope.reload();
        });
    };

    $scope.deleteTask = function(idtask){
        todoFactory.deleteTask(idtask, function(res){
            $scope.reload();
        });
    };

    $scope.deleteList = function(ilist){
        var listsuppr = $scope.listSet[ilist];
        var taskssuppr = listsuppr.listTask;

        for(var i = 0; i < taskssuppr.length; i++) {
            
            $scope.deleteTask(taskssuppr[i]);
        }

        todoFactory.deleteList(listsuppr.nom,function(res){
            if(res.data.success)
                console.log(listsuppr.nom + ' Supprimée');
            else
                console.log('Erreur suppr liste')
            $scope.reload();
        });
    };

    $scope.check =function (ilist, itask){
        var taskcheck = $scope.taskSet[ilist][itask];
        if(taskcheck == null)
            return;
        console.log( taskcheck.done );
        taskcheck.done = !taskcheck.done;
        console.log( taskcheck.done );
        todoFactory.updateTask(taskcheck, function(res){
            console.log(res);
            if(taskcheck.done)
                console.log(taskcheck.text + ' check');
            else
                console.log(taskcheck.text + ' uncheck');
            $scope.reload();
        });
    };

    $scope.updateTask =function (ilist, itask){
        var taskupdate = $scope.taskSet[ilist][itask];
        todoFactory.updateTask(taskupdate,function(res) {
            console.log(res);
            $scope.reload();
        });
    };

 
    $scope.updateList = function(index) {
        var listupdate = $scope.listSet[index];
        var origin = document.getElementById('list' + index).placeholder;
        
        todoFactory.updateList(listupdate, origin, function(res){
            console.log(res);
            $scope.reload();
        });
    };

    $scope.updateAllTaskFromList = function(list, index) {
        todoFactory.updateAllTaskFromList(list,function(res){
            if(res.data.success) {
                $scope.taskSet[index] = res.data.taskSet;
            }
            else
                console.log(res.data.err);
        });
    };

    $scope.reload = function(){
        
        todoFactory.getAllList(window.sessionStorage.getItem('username'),function(listSet) {
            $scope.listSet = listSet;

            for(var i = 0; i < listSet.length; i++) {
                $scope.updateAllTaskFromList(listSet[i], i);
            }
        });
    };

    $scope.reload();  

}]);

//controller utilisateur

todoList.controller('UserController', ['$scope','$http','todoFactory', function($scope,$http, todoFactory) {
    $scope.utilisateur = window.sessionStorage.getItem('username');

    $scope.connect = function() {
        var username = $scope.username;
        var mdp = $scope.mdp;
        todoFactory.findUser(username, mdp, function(success){
            if(success) {
                window.sessionStorage.setItem('username', $scope.username);
                console.log(window.sessionStorage.getItem('username') + ' connecté');
                $scope.identificationErrorField = "";
                window.location.href = '/todolist';
            }
            else {
                console.log('Erreur connexion');
                $scope.identificationErrorField = "Mauvais mdp ou nom d'utilisateur";
            }
        });
    };

    $scope.disconnect = function() {
        console.log(window.sessionStorage.getItem('username') + ' déco');
        window.sessionStorage.setItem('username', null);
        $scope.utilisateur = null;
        window.location.href = '/';
    };

    $scope.createUser = function() {
        
        todoFactory.createUser($scope.username, $scope.mdp, function(res) {
            if(res) {
                if(res.success) {
                    console.log($scope.username + ' ajouté');
                    window.sessionStorage.setItem('username', $scope.username);
                    $scope.creationErrorField = "";
                    window.location.href = '/todolist';
                }
                else {
                    console.log('Erreur');
                    console.log(res.err);
                    if(res.err.code == 11000)
                        $scope.creationErrorField = "Nom déjà utilisé";
                }
            }
        });
    };
}]);