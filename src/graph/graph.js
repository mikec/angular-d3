angular.module('ngd3.graph', ['ngd3.axis'])

.directive('graph', [function() {

    var autoInc = 0;

    return {
        scope: { domain: '=' },
        transclude: true,
        template: '<svg x-margin="35" y-margin="20">' +
                    '<g axis orientation="x" domain="xDomain"></g>' +
                    '<g axis orientation="y" domain="yDomain"></g>' +
                    '<g ng-transclude></g>' +
                  '</svg>',
        link: function($scope, $element, $attrs) {

            var id = 'graph_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            $scope.$watchCollection('domain', function(d) {
                $scope.xDomain = d.x;
                $scope.yDomain = d.y;
            });

        }
    }

}]);