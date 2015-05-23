

var app = angular.module('ngApp', ['ui.router', 'firebase']);

app.constant('FIREBASE_URL', 'https://jennifer.firebaseio.com/');

app.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  $stateProvider

      .state('tasks', {
          url: '/tasks',
          templateUrl: '/templates/tasks.html',
          controller: "TasksCtrl"
      })

      .state('home', {
          url: '/',
          templateUrl: '/templates/home.html', 
          controller: 'HomeCtrl'
      });
});

app.controller('HomeCtrl', function($scope){
  $scope.awesomeThings=["HTML5", "Rails", "AngularJS"];
});

app.controller('TasksCtrl', function($scope, Task){
  $scope.tasks = Task.all;
  $scope.task = {name: '', description: ''};

  $scope.submitTask = function(){
    Task.save($scope.task, function(ref){
      $scope.tasks[ref.name] = $scope.task;
      $scope.task = {name: '', description: ''};
    });
  };

  $scope.deleteTask = function(taskId){
    Task.delete({id: taskId}, function(){
      delete $scope.tasks[taskId];
    });
  };
});

app.factory('Task', function($firebaseArray, $firebaseObject, FIREBASE_URL){
  var ref = new Firebase(FIREBASE_URL);
  var tasks = $firebaseArray(ref.child('tasks'));

  var Task = {
    all: tasks,
    create: function(task){
      return tasks.$add(task);
    },
    get: function(taskId){
      return $firebaseObject(ref.child('tasks').child(taskId));
    },
    delete: function(task){
      return tasks.$remove(task);
    }
  };

  return Task;
});
