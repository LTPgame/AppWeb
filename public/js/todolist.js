var todoList = angular.module('todoList', []);



//controller todo
todoList.controller('todoController',['$scope', 'todoFactory',function($scope, todoFactory){
    $scope.taskSet=[];
    $scope.listSet=[];
    $scope.editionMode = [];
    $scope.editionModeList = [];
    $scope.modalListFocused = null;


    $scope.createTask=function(ilist){
        var user;
        var text;

        user =window.sessionStorage.getItem('username');
        text=document.getElementById('modal-task').value; //aa
        console.log('index liste : ' + ilist);
        if(text == "" || text == undefined || user == null || user == 'null')
            return;
        todoFactory.createTask(user,text,$scope.listSet[ilist].nom, function(res){
            console.log(res);
            if(res){ console.log("Nouvelle tâche ajouté");
             $scope.reload();
            }
        } );
        $scope.tache = "";
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
                console.log('Erreur suppression liste')
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
        $scope.taskSet[ilist][itask].editMode = false;
        var taskupdate = $scope.taskSet[ilist][itask];
        taskupdate.text = document.getElementById('text-field'+ilist+'-'+itask).value;
        todoFactory.updateTask(taskupdate,function(res) {
            console.log(res);
            $scope.reload();
        });
    };

 
    $scope.updateList = function(index){
        var areas = document.getElementsByClassName('liste-area');
        var origin = areas[index].textContent;
        var listupdate = $scope.listSet[index];
        var elements = document.getElementsByClassName('text-field-list');
        listupdate.nom = elements[index].value;
        console.log(origin);
        todoFactory.updateList(listupdate, origin, function(res){
            console.log(res);
            $scope.reload();
        });
    };

    $scope.updateAllTaskFromList = function(list, index) {
        todoFactory.updateAllTaskFromList(list,function(res){
            if(res.data.success) {
                $scope.taskSet[index] = res.data.taskSet;
                for(var i = 0; i < $scope.taskSet[index].length; i++) {
                    $scope.taskSet[index][i].editMode = false;
                }
            }
            else
                console.log(res.data.err);
        });
    };

    $scope.edit = function(ilist,itask) {
        $scope.taskSet[ilist][itask].editMode = true;
        setTimeout( function(){
            var element = document.getElementById('text-field'+ilist+'-'+itask);
            element.select();
        }, 10);
    };

    $scope.editList = function( index){
        for(var i = 0; i < $scope.editionModeList.length; i++)
            $scope.editionModeList[i] = false;
        $scope.editionModeList[index] = true;
        setTimeout( function (){
            var elements = document.getElementsByClassName('text-field-list');
            elements[index].select();
        }, 10);
    };

    $scope.setModalFocus =function( index){
        $scope.modalListFocused = index;
    };

    $scope.reload = function(){
        
        todoFactory.getAllList(window.sessionStorage.getItem('username'),function(listSet) {
            $scope.listSet = listSet;
            $scope.editionModeList = [];

            for(var i = 0; i < listSet.length; i++) {
                $scope.updateAllTaskFromList(listSet[i], i);
                $scope.editionModeList.push(false);
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
        console.log(window.sessionStorage.getItem('username') + ' déconnecté');
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