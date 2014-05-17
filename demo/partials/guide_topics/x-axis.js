angular.module('guide.xAxis', [])

.controller('xAxisCtrl', ['$scope', function($scope) {
    
    var d1 = new Date();
    var d2 = new Date(d1.getTime() + 365 * 24 * 60 * 60 * 1000);
    $scope.xDomain = [d1, d2];

}]);