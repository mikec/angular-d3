angular.module('ngd3.multiline', ['ngd3.services'])

.directive('multiline', ['graph', function(graph) {

    var autoInc = 0;

    return {

        link: function($scope, $element, $attrs) {

            var id = 'multiline_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var SVG = graph.getSVG($element);

            var xScale = SVG.xTimeScale;
            var yScale = SVG.yLinearScale;

            $scope.$watch(SVG.dataScope, function(data) {

                if(!data) return;

                var domains = graph.getDomains(data);

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

                var line = d3.svg.line()
                    .interpolate("basis") // for curved lines
                    .x(function(d) { return xScale(d.x); })
                    .y(function(d) { return yScale(d.y); });

                xScale.domain(domains.x);
                yScale.domain(domains.y);

                var elemNode = d3.select('#'+id);
                var items = elemNode.selectAll(".item")
                    .data(lines)
                    .enter().append("g")
                    .attr("class", "item")
                    .attr("transform", "translate(" + SVG.xMargin + "," + SVG.yMargin + ")");

                items.append("path")
                    .attr("class", "line")
                    .style("stroke", function(d) { return color(d.title); })
                items.append("text");

                items
                    .select("path")
                    .transition()
                    .attr("d", function(d) {
                        return line(d.points); 
                    });

            });
        }

    }

}]);