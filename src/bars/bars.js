angular.module('ngd3.bars', [])

.directive('bars', [function() {

    var autoInc = 0;
    var defaultBarThickness = 20;
    var defaultBarSpacing = 1;

    return {

        link: function($scope, $element, $attrs) {

            var id = 'bars_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var elemNode = d3.select('#'+id);

            var barThickness = $attrs.thickness > 0 ? 
                                    parseInt($attrs.thickness) : defaultBarThickness;
            var spacing = $attrs.spacing > 0 ?
                                parseInt($attrs.spacing) : defaultBarSpacing;

            $scope.$watch($attrs.bars, function(data) {
                if($scope.graphScopeSet) {
                    var xScale = $scope.timeScaleX;
                    var yScale = $scope.linearScaleY;

                    var bars = elemNode.selectAll("g")
                                        .data(data);

                    bars.transition()
                        .attr("transform", function(d, i) {
                            var x = ($scope.marginX + barThickness) + i * barThickness;
                            var y = yScale(d) + $scope.marginY;
                            return "translate(" + x + "," + y + ")"; 
                        });

                    bars.enter().append("g")
                        .attr("transform", function(d, i) {
                            var x = ($scope.marginX + barThickness) + i * barThickness;
                            var y = yScale(d) + $scope.marginY;
                            return "translate(" + x + "," + y + ")"; 
                        })
                        .append("rect")
                        .attr("class", "bar")
                        .attr("width", barThickness - spacing);

                    bars.select("rect")
                        .transition()
                        .attr("height", function(d) {
                            return $scope.graphInnerHeight - yScale(d);
                        });
                }

            });

        }

    }

}]);