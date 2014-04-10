angular.module('ngd3.bars', ['ngd3.services'])

.directive('bars', ['GraphElement', 
function(GraphElement) {

    var autoInc = 0;

    return {

        link: function($scope, $element, $attrs) {

            var barThickness = 20;

            var id = 'bars_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var graph = GraphElement.findByChild($element);

            var elemNode = d3.select('#'+id);

            $scope.$watch(graph.dataScope, function(data) {
                var xScale = graph.xTimeScale;
                var yScale = graph.yLinearScale;

                var bars = elemNode.selectAll("g")
                                    .data(data);

                bars.transition()
                    .attr("transform", function(d, i) {
                        var x = (graph.xMargin + barThickness) + i * barThickness;
                        var y = yScale(d) + graph.yMargin;
                        return "translate(" + x + "," + y + ")"; 
                    });


                bars.enter().append("g")
                    .attr("transform", function(d, i) {
                        var x = (graph.xMargin + barThickness) + i * barThickness;
                        var y = yScale(d) + graph.yMargin;
                        return "translate(" + x + "," + y + ")"; 
                    })
                    .append("rect")
                    .attr("class", "bar")
                    .attr("width", barThickness - 1);

                bars.select("rect")
                    .transition()
                    .attr("height", function(d) {
                        return graph.graphInnerHeight - yScale(d);
                    });

            });

        }

    }

}]);