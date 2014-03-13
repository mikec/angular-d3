angular.module('demo', ['ngd3'])

.controller('DemoCtrl', ['$scope', function($scope) {

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
                data[city][j] = {
                    date: date,
                    value: val
                };
            }

        }

        return data;
    };

}]);