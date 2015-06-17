var app = angular.module('myApp',[]);
app.controller('PhoneListControl', ['$scope', '$http', function($scope, $http) {
  $http.get('./phone.json').success(function(data) {
    $scope.phones = data;
  });
}]);
