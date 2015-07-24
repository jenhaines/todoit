angular.module('ngApp')

.controller('SeedDataCtrl', function(Todo, $scope){
  $scope.todos= Todo.all;  
  debugger;

  $scope.createTodo = function(){
    var todo = {};
    todo.title = chance.sentence({words: 5});
    todo.level = rndNumGen(1, 3);
    // var timestamp = getRandomDate();
    var timestamp = Firebase.ServerValue.TIMESTAMP;
    todo.created = getRandomDate();
    todo.completed = getRandomStatus();
    Todo.create(todo).then(function(){
      alert('Todo created!';
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
      return false;
    }else{
      return true;
    };
  };
})

.factory('Todo', function($firebase, $firebaseArray, $firebaseObject, FIREBASE_URL){
  var ref = new Firebase(FIREBASE_URL + '/todos');
  // var query = ref.orderByChild('created');
  var todos = $firebaseArray(ref);
  var Todo = {
    all: todos,
    create: function(todo){
      return todos.$add(todo);
    },
    get: function(todoId){
      return $firebaseObject(ref.child('todos').child(todoId));
    },
    delete: function(todo){
      return todos.$remove(todo);
    },
    markComplete: function(todo){
        todo.status = 'complete';
        return todos.$save(todo);
    }
  };

  return Todo;
});