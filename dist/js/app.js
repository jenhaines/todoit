(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


var app = angular.module('ngApp', ['ui.router', 'firebase']);

app.constant('FIREBASE_URL', 'https://jennifer.firebaseio.com/tasks/');

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

app.controller('TasksCtrl', function($scope, $firebaseArray, FIREBASE_URL){
    var ref = new Firebase(FIREBASE_URL);
    $scope.tasks = $firebaseArray(ref);

    $scope.addTask = function(){
      $scope.tasks.$add({
        name: $scope.name,
        desc: $scope.desc
      });
    };

});

// app.factory('Task', function($firebaseArray, $firebaseObject, FIREBASE_URL){
//   var ref = new Firebase(FIREBASE_URL);
//   var tasks = $firebaseArray(ref.child('tasks'));

//   var Task = {
//     all: tasks,
//     create: function(task){
//       return tasks.$add(task);
//     },
//     get: function(taskId){
//       return $firebaseObject(ref.child('tasks').child(taskId));
//     },
//     delete: function(task){
//       return tasks.$remove(task);
//     }
//   };

//   return Task;
// });

},{}]},{},[1]);