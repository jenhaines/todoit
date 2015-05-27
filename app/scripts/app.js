

var app = angular.module('ngApp', ['ui.router', 'firebase']);

app.constant('FIREBASE_URL', 'https://jennifer.firebaseio.com/tasks');

app.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/tasks');

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
  $scope.task = {desc: '', level: 'high', status: 'active'};
  $scope.levels = ['high', 'medium', 'low'];

  $scope.submitTask = function(){
    Task.create($scope.task).then(function(){
      $scope.task = {desc: '', level: 'high', status: 'active'};
    });
  };

  $scope.deleteTask = function(task){
    Task.delete(task);
  };
});

app.factory('Task', function($firebase, $firebaseArray, $firebaseObject, FIREBASE_URL){
  var ref = new Firebase(FIREBASE_URL);
  var tasks = $firebaseArray(ref);

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
