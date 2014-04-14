angular.module('ngd3.bars', [])

.directive('bars', [function() {

    var autoInc = 0;
    var defaultBarThickness = 20;

    return {

        link: function($scope, $element, $attrs) {

            var id = 'bars_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var elemNode = d3.select('#'+id);

            var barThickness = $attrs.thickness > 0 ? 
                                    parseInt($attrs.thickness) : defaultBarThickness;
            var spacing = $attrs.spacing > 0 ?
                                parseInt($attrs.spacing) : null;

            var barData;

            $scope.$watch($attrs.bars, function(data) {
                barData = data;
                if($scope.graphScopeSet && barData && barData.length > 0) {
                    var xScale = $scope.timeScaleX;
                    var yScale = $scope.linearScaleY;

                    var bars = elemNode.selectAll("g")
                                        .data(barData);

                    if(!spacing && spacing != 0) {
                        spacing = getAutoFitSpacing();
                    }

                    if((barThickness + spacing) * barData.length > $scope.graphInnerWidth) {
                        // if barThickness + spacing will cause the bars to exceed the width of
                        // the graph, remove all spacing and maximize the bar thickness
                        spacing = 0;
                        barThickness = $scope.graphInnerWidth / barData.length;
                    }


                    bars.transition()
                        .attr("transform", function(d, i) {
                            var x = ($scope.marginX + spacing) + i * (barThickness + spacing);
                            var y = yScale(d) + $scope.marginY;
                            return "translate(" + x + "," + y + ")"; 
                        });

                    bars.enter().append("g")
                        .attr("transform", function(d, i) {
                            var x = ($scope.marginX + spacing) + i * (barThickness + spacing);
                            var y = yScale(d) + $scope.marginY;
                            return "translate(" + x + "," + y + ")"; 
                        })
                        .append("rect")
                        .attr("class", "bar")
                        .attr("width", barThickness);

                    bars.select("rect")
                        .transition()
                        .attr("height", function(d) {
                            return $scope.graphInnerHeight - yScale(d);
                        });
                }

            });

            $scope.$on('graphResize', function(event) {
                
            });

            function getAutoFitSpacing() {
                var spacing = 0;
                if(barData) {
                    var numBars = barData.length;
                    if(numBars > 0) {
                        var widthPerBar = ($scope.graphInnerWidth + barThickness) / (numBars + 1);
                        var spacing = widthPerBar - barThickness;
                        if(spacing < 0) spacing = 0;
                    }
                }
                return spacing;
            }

        }

    }

}]);