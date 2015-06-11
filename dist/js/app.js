(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


var app = angular.module('ngApp', ['ui.router', 'firebase']);

app.constant('FIREBASE_URL', 'https://jennifer.firebaseio.com');

app.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/active');

  $stateProvider

      .state('active', {
          url: '/active',
          templateUrl: '/templates/activeTasks.html',
          controller: 'TasksCtrl'
      })

      .state('complete', {
          url: '/complete',
          templateUrl: '/templates/completeTasks.html',
          controller: 'TasksCtrl'
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
  $scope.task = {desc: '', level: 'high'};
  $scope.levels = ['high', 'medium', 'low']; 
  

  $scope.submitTask = function(task){
    // var timestamp = Firebase.ServerValue.TIMESTAMP;
    var timestamp = getRandomDate().getTime();
    task.created = timestamp;
    // task.status = 'active';
    task.status = getRandomStatus();
    Task.create(task).then(function(){
      $scope.task = {desc: '', level: 'high'};
    });
  };

// used to create realistic seed data
  var getRandomDate = function() {
    var from = new Date(2015, 0, 1).getTime();
    var to = new Date(2015, 5, 10).getTime();
    return new Date(from + Math.random() * (to - from));
  };

  var getRandomStatus = function() {
    var x = Math.random();
    if(x===0){
      return 'active';
    }else{
      return 'complete';
    };
  };

  $scope.deleteTask = function(task){
    Task.delete(task);
  };
});

app.factory('Task', function($firebase, $firebaseArray, $firebaseObject, FIREBASE_URL){
  var ref = new Firebase(FIREBASE_URL + '/tasks');
  var query = ref.orderByChild('created');
  // var reverseResults = [];

  // query.once('value', function(snap){
  //   var results = [];
  //   snap.forEach(function(data){
  //     results.push(data.val());
  //   });
  //   reverseResults = results.reverse();
  // });

  // console.log(reverseResults);

  var tasks = $firebaseArray(query);

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

},{}]},{},[1]);