angular.module('ngd3.multiline', ['ngd3.services'])

.directive('multiline', ['DataSet', 'SvgElement', 
function(DataSet, SvgElement) {

    var autoInc = 0;

    return {

        link: function($scope, $element, $attrs) {

            var id = 'multiline_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var xScale, yScale;

            var parentSvg = SvgElement.findSvgParent($element);
            var svg = new SvgElement(parentSvg);

            var elemNode = d3.select('#'+id);

            var line = d3.svg.line()
                .interpolate("basis") // for curved lines
                .x(function(d) { return xScale(d.x); })
                .y(function(d) { return yScale(d.y); });

            $scope.$watch(svg.dataScope, function(data) {

                if(!data) return;

                xScale = svg.xTimeScale;
                yScale = svg.yLinearScale;

                var dataSet = new DataSet(data);

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

                xScale.domain(dataSet.x);
                yScale.domain(dataSet.y);

                var items = elemNode.selectAll(".item")
                    .data(lines).enter().append("g")
                    .attr("class", "item")
                    .attr("transform", "translate(" + svg.xMargin + "," + svg.yMargin + ")");

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