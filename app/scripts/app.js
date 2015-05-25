

var app = angular.module('ngApp', ['ui.router', 'firebase']);

app.constant('FIREBASE_URL', 'https://jennifer.firebaseio.com/tasks');

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
  $scope.task = {desc: '', priority: '', status: 'active'};

  $scope.submitTask = function(){
    Task.create($scope.task).then(function(){
      $scope.task = {desc: '', priority: '', status: 'active'};
    });
  };

  $scope.deleteTask = function(task){
    Task.delete(task);
  };
});

app.factory('Task', function($firebaseArray, $firebaseObject, FIREBASE_URL){
  var ref = new Firebase(FIREBASE_URL);
  var tasks = $firebaseArray(ref);

  var Task = {
    all: tasks,
    create: function(task){
      return tasks.$add(task);
    },
    get: function(taskId){
      return $firebaseObject(ref.child(taskId));
    },
    delete: function(task){
      return tasks.$remove(task);
    }
  };

  return Task;
});
