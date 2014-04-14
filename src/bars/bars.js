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
            var barSpacing = $attrs.spacing > 0 ?
                                parseInt($attrs.spacing) : null;
            var autoFit = (barSpacing === null);

            var barData, xScale, yScale, bars, rects;

            $scope.$watch($attrs.bars, function(data) {
                barData = data;
                if($scope.graphScopeSet && barData && barData.length > 0) {
                    xScale = $scope.timeScaleX;
                    yScale = $scope.linearScaleY;

                    bars = elemNode.selectAll("g")
                                        .data(barData);

                    var layout = calculateBarLayout();

                    applyBarSpacing(bars.transition(), layout.spacing);

                    applyBarSpacing(bars.enter().append("g"), layout.spacing)
                        .append("rect")
                        .attr("class", "bar");

                    rects = bars.select("rect");

                    applyBarThickness(rects, layout.thickness);

                    rects.transition()
                        .attr("height", function(d) {
                            return $scope.graphInnerHeight - yScale(d);
                        });
                }

            });

            $scope.$on('graphResize', function(event) {
                var layout = calculateBarLayout();
                applyBarSpacing(bars, layout.spacing);
                applyBarThickness(rects, layout.thickness);
            });

            function applyBarThickness(barRectNodes, thickness) {
                if(barRectNodes) {
                    return barRectNodes.attr("width", thickness);
                }
            }

            function applyBarSpacing(barNodes, spacing) {
                if(barNodes) {
                    return barNodes.attr("transform", function(d, i) {
                        var x = ($scope.marginX + spacing) + i * (barThickness + spacing);
                        var y = yScale(d) + $scope.marginY;
                        return "translate(" + x + "," + y + ")"; 
                    });
                }
            }

            function calculateBarLayout() {
                var layout = {
                    spacing: barSpacing,
                    thickness: barThickness
                };
                if(barData && barData.length > 0) {
                    var numBars = barData.length;
                    if(autoFit) {
                        layout.spacing = getAutoFitSpacing();
                    }

                    if((barThickness + layout.spacing) * numBars > $scope.graphInnerWidth) {
                        // if barThickness + spacing will cause the bars to exceed the width of
                        // the graph, remove all spacing and maximize the bar thickness
                        layout.spacing = 0;
                        layout.thickness = $scope.graphInnerWidth / numBars;
                    }
                }
                return layout;
            }

            function getAutoFitSpacing() {
                var autoFitSpacing = 0;
                if(barData) {
                    var numBars = barData.length;
                    if(numBars > 0) {
                        var widthPerBar = ($scope.graphInnerWidth + barThickness) / (numBars + 1);
                        autoFitSpacing = widthPerBar - barThickness;
                        if(autoFitSpacing < 0) autoFitSpacing = 0;
                    }
                }
                return autoFitSpacing;
            }

        }

    }

}]);