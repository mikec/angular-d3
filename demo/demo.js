angular.module('demo', ['ui.router', 'ngd3'])

.config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/linegraph");

    $stateProvider
        .state('linegraph', {
            url: '/linegraph',
            templateUrl: 'partials/linegraph.html',
            controller: 'LinegraphCtrl'
        })
        .state('bargraph', {
            url: '/bargraph',
            templateUrl: 'partials/bars.html',
            controller: 'BarsCtrl'
        })
        .state('axis', {
            url: '/axis',
            templateUrl: 'partials/axis.html',
            controller: 'AxisCtrl'
        });
}])

.controller('LinegraphCtrl', ['$scope', function($scope) {

    $scope.generateData = function() {
        $scope.randomData = getGeneratedData();
    }

    $scope.generateData();

    function getGeneratedData() {
        var data = {};

        var cities = [
            "New York",
            "Boston",
            "Seattle",
            "Denver"
        ];

        var numDataPoints = 100;
        var currentDate = new Date();

        for(var i in cities) {

            var city = cities[i];
            data[city] = [];

            var v = (i * 15);
            for(var j=0; j < numDataPoints; j++) {
                var val = v + (Math.floor((Math.random()*10)+1) - 5);
                var date = new Date();
                date.setDate(currentDate.getDate() + j);
                data[city][j] = [date, val];
            }

        }

        return data;
    };

}])

.controller('BarsCtrl', ['$scope', function($scope) {

    var maxVal = 100;

    $scope.generateData = function() {
        $scope.barData = getGeneratedData();
        $scope.xDomain = [0, 5];
        $scope.yDomain = [0, maxVal];
    }

    $scope.generateData();

    function getGeneratedData() {
        var d = [];
        for(var i = 0; i < 35; i++) {
            d.push(Math.random()*maxVal);
        }
        return d;
    }

}])

.controller('AxisCtrl', ['$scope', function($scope) {

    var d1 = new Date();
    var d2 = new Date(d1.getTime() + 365 * 24 * 60 * 60 * 1000);
    $scope.xDomain = [d1, d2];

    $scope.yDomain = [0, 1000];

}]);

