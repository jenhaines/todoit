

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

      .state('home', {
          url: '/',
          templateUrl: '/templates/home.html', 
          controller: 'HomeCtrl'
      });
});

app.controller('HomeCtrl', function($scope){
  $scope.awesomeThings=["HTML5", "Rails", "AngularJS"];
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
});

app.filter('convertLevel', function(){
    return function(level){
    debugger;
      if(level===1){
        return 'High';
      }else if(level===2){
        return 'Medium';
      }else{
        return 'Low';
      }   
    }
});

app.controller('CompleteTasksCtrl', function($scope, Task){
   $scope.tasks = Task.all;

   $scope.isExpired = function(item){
       var d = new Date();
       var d7 = d.setDate(d.getDate()-7);
       var fdatenow = new Date(d7);
       var itemDate = new Date(item.created);
      if((itemDate < fdatenow) || (item.status==='complete')){
        return item;
      };
   };

});



app.factory('Task', function($firebase, $firebaseArray, $firebaseObject, FIREBASE_URL){
  var ref = new Firebase(FIREBASE_URL + '/tasks');
  var query = ref.orderByChild('created');

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
    },
    markComplete: function(task){
        task.status = 'complete';
        return tasks.$save(task);
    }
  };

  return Task;
});
