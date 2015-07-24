(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('ngApp', ['ui.router', 'firebase', 'ngAnimate'])

.constant('FIREBASE_URL', 'https://jennifer.firebaseio.com')

.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  $stateProvider

      .state('active', {
          url: '/',
          templateUrl: '/templates/activeTasks.html',
          controller: 'ActiveTasksCtrl'
      })

      .state('complete', {
          url: '/complete',
          templateUrl: '/templates/completeTasks.html',
          controller: 'CompleteTasksCtrl'
      })

      .state('seed', {
        url: '/seed',
        templateUrl: '/templates/seed.html',
        controller: 'SeedDataCtrl'
      });
})

.controller('SeedDataCtrl', function(Task, $scope){
  $scope.tasks= Task.all;

  $scope.createTask = function(){
    var task = {};
    task.desc = chance.sentence({words: 5});
    task.level = rndNumGen(1, 3);
    // var timestamp = getRandomDate();
    var timestamp = Firebase.ServerValue.TIMESTAMP;
    task.created = getRandomDate();
    task.status = getRandomStatus();
    Task.create(task).then(function(){
      $scope.tasklist = 'Task created!';
    });
  };

  // random number generator
  var rndNumGen = function(start, finish){
    return Math.floor((Math.random() * finish) + start);
  };

// used to create realistic seed data
  var getRandomDate = function() {
    var from = new Date(2015, 5, 1).getTime();
    var to = new Date().getTime();
    return new Date(from + Math.random() * (to - from)).getTime();
  };

  var getRandomStatus = function() {
    var x = rndNumGen(0, 1);
    if(x===0){
      return 'active';
    }else{
      return 'complete';
    };
  };
})

.controller('ActiveTasksCtrl', function($scope, Task){
  $scope.tasks = Task.all;
  $scope.task = {desc: '', level: 1};
  $scope.levels = [{'value': 1, 'text': 'High'}, {'value': 2, 'text': 'Medium'}, {'value': 3, 'text': 'Low'}]; 

  $scope.submitTask = function(task){
    var timestamp = Firebase.ServerValue.TIMESTAMP;
    task.created = timestamp;
    task.status = 'active';
    Task.create(task).then(function(){
      $scope.task = {desc: '', level:  1};
    });
  };

  $scope.markComplete = function(task){
    if( confirm('Are you sure?')) {
      Task.markComplete(task);
    };
  };
})


.filter('convertLevel', function(){
    return function(level){
      var levels = {1: 'High', 2: 'Medium', 3: 'Low'};
      return levels[level];
    }
})

.filter('isExpired', function(){
  return function(items){
    var filtered =[]
    var d = new Date();
    var d7 = d.setDate(d.getDate()-7);
    var fdatenow = new Date(d7);
    for(var i=0; i<items.length; i++){
      var item = items[i];
      var itemDate = new Date(item.created);
      if((itemDate < fdatenow) || (item.status==='complete')){
          filtered.push(item);
      }
    }
    return filtered;
  }
})

.filter('currentTasks', function(){
  return function(items){
    var filtered =[]
    var d = new Date();
    var d7 = d.setDate(d.getDate()-7);
    var fdatenow = new Date(d7);
    for(var i=0; i<items.length; i++){
      var item = items[i];
      var itemDate = new Date(item.created);
      if((itemDate > fdatenow) &&(item.status==='active')){
          filtered.push(item);
      }
    }
    return filtered;
  }
})

.controller('CompleteTasksCtrl', function($scope, Task){
   $scope.tasks = Task.all;

   $scope.oldActive = function(status){
      if(status==='active'){
        return 'expired';
      }else{
        return status;
      };
    };
})

.factory('Task', function($firebase, $firebaseArray, $firebaseObject, FIREBASE_URL){
  var ref = new Firebase(FIREBASE_URL + '/tasks');
  // var query = ref.orderByChild('created');

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
    },
    markComplete: function(task){
        task.status = 'complete';
        return tasks.$save(task);
    }
  };

  return Task;
});
},{}]},{},[1]);