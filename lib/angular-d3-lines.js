angular.module('ngd3.lines', [])

.directive('lines', ['domain', function(domain) {

    var autoInc = 0;

    return {

        link: function($scope, $element, $attrs) {

            var id = 'lines_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var xScale, yScale, lineData, domains, paths;

            var elemNode = d3.select('#'+id);

            var line = d3.svg.line()
                .interpolate("basis") // for curved lines
                .x(function(d) { return xScale(d.x); })
                .y(function(d) { return yScale(d.y); });

            $scope.$watch($attrs.lines, function(data) {

                if(!data) return;

                if($scope.graphScopeSet) {

                    domains = domain.getLineDataDomains(data);

                    setScale();

                    lineData = [];
                    for(var lineTitle in data) {
                        lineData.push({
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
                    color.domain(lineData.map(function(ln) { return ln.title; }));

                    var items = elemNode.selectAll(".item")
                        .data(lineData).enter().append("g")
                        .attr("class", "item")
                        .attr("transform", "translate(" + 
                                                $scope.marginX + "," + 
                                                $scope.marginY + 
                                            ")");

                    items = elemNode.selectAll(".item");

                    items.append("path")
                        .attr("class", "line")
                        .style("stroke", function(d) { return color(d.title); });

                    paths = items.select("path");

                    drawLines(paths.transition());
                }

            });

            $scope.$on('graphResize', function(event) {
                setScale();
                drawLines(paths);
            });

            function drawLines(pathNode) {
                if(pathNode) {
                    pathNode.attr("d", function(d) {
                            return line(d.points); 
                        });
                }
            }

            function setScale() {
                xScale = $scope.timeScaleX;
                yScale = $scope.linearScaleY;

                xScale.domain(domains.x);
                yScale.domain(domains.y);
            }
        }

    }

}]);