angular.module('ngd3.axis', [])

.directive('axis', [function() {

    var autoInc = 0;

    return {
        link: function($scope, $element, $attrs) {

            var id = 'axis_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var domainScope = $attrs.domain;
            var xyAxisNode = d3.select('#' + id);

            var orientY = $attrs.orientation && 
                            $attrs.orientation.toLowerCase() == 'y';

            $element.addClass('axis');
            $element.addClass(orientY ? 'y' : 'x');

            if($scope.graphScopeSet) {

                var xyScale = orientY ? $scope.linearScaleY : $scope.linearScaleX;

                var xyAxis = d3.svg.axis()
                    .scale(xyScale)
                    .orient(orientY ? "left" : "bottom");

                var xTrans, yTrans;
                if(!orientY) {
                    xTrans = $scope.graphHeight - $scope.marginY;
                    yTrans = $scope.marginX;
                } else {
                    xTrans = $scope.marginY;
                    yTrans = $scope.marginX;
                }
                xyAxisNode
                    .attr("transform", 
                            "translate(" + yTrans + "," + xTrans + ")");

                $scope.$watchCollection(domainScope, function(domain) {  
                    if(domain) {
                        if(domain[0] instanceof Date) {
                            xyScale = orientY ? $scope.timeScaleY : $scope.timeScaleX;
                            xyAxis.scale(xyScale);
                        }
                        xyScale.domain(domain);
                        xyAxisNode.call(xyAxis);
                    }
                });
            }

        }
    }

}]);