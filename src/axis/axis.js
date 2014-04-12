angular.module('ngd3.axis', [])

.directive('axis', [function() {

    var autoInc = 0;

    return {
        link: function($scope, $element, $attrs) {

            var id = 'axis_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var domainScope = $attrs.domain;
            var domain;
            var xyAxisNode = d3.select('#' + id);

            var orientY = $attrs.orientation && 
                            $attrs.orientation.toLowerCase() == 'y';

            $element.addClass('axis');
            $element.addClass(orientY ? 'y' : 'x');

            if($scope.graphScopeSet) {

                var xyScale;

                var xyAxis = d3.svg.axis()
                    .orient(orientY ? "left" : "bottom");

                setAxisScale();

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

                $scope.$watchCollection(domainScope, function(d) {
                    domain = d;
                    if(domain) {
                        renderAxis();
                    }
                });

                $scope.$on('graphResize', function(event) {
                    renderAxis();
                });

            }

            function renderAxis() {
                setAxisScale(domain && domain[0] instanceof Date);
                xyScale.domain(domain);
                xyAxisNode.call(xyAxis);
            }

            function setAxisScale(isTimeScale) {
                xyScale = orientY ? 
                            (isTimeScale ? $scope.timeScaleY : $scope.linearScaleY) : 
                            (isTimeScale ? $scope.timeScaleX : $scope.linearScaleX);
                xyAxis.scale(xyScale);
            }

        }
    }

}]);