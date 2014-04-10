angular.module('ngd3.multiline', ['ngd3.services'])

.directive('multiline', ['domain', 'GraphElement', 
function(domain, GraphElement) {

    var autoInc = 0;

    return {

        link: function($scope, $element, $attrs) {

            var id = 'multiline_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var xScale, yScale;

            var graph = GraphElement.findByChild($element);

            var elemNode = d3.select('#'+id);

            var line = d3.svg.line()
                .interpolate("basis") // for curved lines
                .x(function(d) { return xScale(d.x); })
                .y(function(d) { return yScale(d.y); });

            $scope.$watch(graph.dataScope, function(data) {

                if(!data) return;

                xScale = graph.xTimeScale;
                yScale = graph.yLinearScale;

                var lines = [];
                for(var lineTitle in data) {
                    lines.push({
                        title: lineTitle,
                        points: data[lineTitle].map(function(d) {
                            return {
                                x: d[0],
                                y: d[1]
                            };
                        })
                    });
                }

                var color = d3.scale.category10();
                color.domain(lines.map(function(ln) { return ln.title; }));

                var domains = domain.getLineDataDomains(data);
                xScale.domain(domains.x);
                yScale.domain(domains.y);

                var items = elemNode.selectAll(".item")
                    .data(lines).enter().append("g")
                    .attr("class", "item")
                    .attr("transform", "translate(" + graph.xMargin + "," + graph.yMargin + ")");

                items = elemNode.selectAll(".item");

                items.append("path")
                    .attr("class", "line")
                    .style("stroke", function(d) { return color(d.title); });

                items.append("text");

                items.select("path")
                    .transition()
                    .attr("d", function(d) {
                        return line(d.points); 
                    });

            });
        }

    }

}]);