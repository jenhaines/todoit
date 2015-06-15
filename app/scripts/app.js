var app = angular.module('ngApp', ['ui.router', 'firebase']);

app.constant('FIREBASE_URL', 'https://jennifer.firebaseio.com');

app.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/active');

  $stateProvider

      .state('active', {
          url: '/active',
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

app.controller('SeedDataCtrl', function(Task, $scope){
  $scope.tasks= Task.all;

  $scope.createTask = function(){
    var task = {};
    task.desc = chance.sentence({words: 5});
    task.level = rndNumGen(1, 3)
    var timestamp = getRandomDate();
    task.created = timestamp;
    task.status = getRandomStatus();
    Task.create(task);
  };

  // random number generator
  var rndNumGen = function(start, finish){
    return Math.floor((Math.random() * finish) + start);
  };

// used to create realistic seed data
  var getRandomDate = function() {
    var from = new Date(2015, 0, 1).getTime();
    var to = new Date().getTime();
    return new Date(from + Math.round(Math.random()) * (to - from)).getTime();
  };

  var getRandomStatus = function() {
    var x = rndNumGen(0, 1);
    if(x===0){
      return 'active';
    }else{
      return 'complete';
    };
  };
});

app.controller('ActiveTasksCtrl', function($scope, Task){
  $scope.tasks = Task.all;
  $scope.task = {desc: '', level: 1};
  $scope.levels = [{'value': 1, 'text': 'High'}, {'value': 2, 'text': 'Medium'}, {'value': 3, 'text': 'Low'}]; 

  $scope.submitTask = function(task){
    var timestamp = Firebase.ServerValue.TIMESTAMP;
    // var timestamp = getRandomDate().getTime();
    task.created = timestamp;
    task.status = 'active';
    // task.status = getRandomStatus();
    Task.create(task).then(function(){
      $scope.task = {desc: '', level:  1};
    });
  };

  $scope.markComplete = function(task){
    if( confirm('Are you sure?')) {
      Task.markComplete(task);
    };
  };
});


app.filter('convertLevel', function(){
    return function(level){
      if(level===1){
        return 'High';
      }else if(level===2){
        return 'Medium';
      }else{
        return 'Low';
      }   
    }
});

app.filter('isExpired', function(){
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
});

app.filter('currentTasks', function(){
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
});

app.controller('CompleteTasksCtrl', function($scope, Task){
   $scope.tasks = Task.all;

   $scope.oldActive = function(status){
      if(status==='active'){
        return 'expired';
      }else{
        return status;
      };
   };

});


app.factory('Task', function($firebase, $firebaseArray, $firebaseObject, FIREBASE_URL){
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