angular.module('guide.xAxis', [])

.controller('xAxisCtrl', ['$scope', function($scope) {
    // get today's date
    var d1 = new Date();

    // get the date 1 year from today
    var d2 = new Date(d1.getTime() + 365 * 24 * 60 * 60 * 1000);

    // set the domain for the X axis to a range from d1 to d2
    $scope.xDomain = [d1, d2];
}]);