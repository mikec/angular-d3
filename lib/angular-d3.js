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
angular.module('ngd3.bars', [])

.directive('bars', [function() {

    var autoInc = 0;

    return {

        link: function($scope, $element, $attrs) {

            var barThickness = 20;

            var id = 'bars_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var elemNode = d3.select('#'+id);

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
                        .attr("width", barThickness - 1);

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
angular.module('ngd3.graph', ['ngd3.services'])

.directive('graph', ['scale',  function(scale) {

    var defaultMarginX = 30;
    var defaultMarginY = 20;

    return {
        compile: function (tElement, tAttrs, transclude) {

            function setLayoutData(scope, element) {
                // full width, including axis margins
                scope.graphWidth = element.prop('offsetWidth');
                scope.graphHeight = element.prop('offsetHeight');
                
                // "inner" means between axis lines, excluding axis margins
                scope.graphInnerWidth = scope.graphWidth - (scope.marginX * 2);
                scope.graphInnerHeight = scope.graphHeight - (scope.marginY * 2);
                
                // range for x axis
                scope.rangeStartX = 0;
                scope.rangeStopX = scope.graphInnerWidth;
                
                // range for y axis
                scope.rangeStartY = scope.graphInnerHeight;
                scope.rangeStopY = 0;
                
                // linear scales
                scope.linearScaleX = scale.getLinearScale(scope.rangeStartX, scope.rangeStopX);
                scope.linearScaleY = scale.getLinearScale(scope.rangeStartY, scope.rangeStopY);
                
                // time scales
                scope.timeScaleX = scale.getTimeScale(scope.rangeStartX, scope.rangeStopX);
                scope.timeScaleY = scale.getTimeScale(scope.rangeStartY, scope.rangeStopY);
            }

            return {
                pre: function preLink($scope, $element, $attrs) {
                    // flag to determine whether graph scope is set
                    $scope.graphScopeSet = true;

                    $scope.marginX = $attrs.marginX >= 0 ? parseInt($attrs.marginX) : defaultMarginX;
                    $scope.marginY = $attrs.marginY >= 0 ? parseInt($attrs.marginY) : defaultMarginY;
                    
                    setLayoutData($scope, $element);
                },
                post: function postLink($scope, $element, $attrs) {
                    angular.element(window).bind('resize', function(event) {

                        setLayoutData($scope, $element);

                        $scope.$broadcast('graphResize', event);

                    });
                }
            }
        }
    };

}]);
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
if (typeof angular === 'undefined') { 
    throw new Error('angular-d3 requires angular.js. https://github.com/angular/angular.js');
}
if (typeof d3 === 'undefined') { 
    throw new Error('angular-d3 requires d3.js. https://github.com/mbostock/d3');
}

angular.module('ngd3', [
    'ngd3.services',
    'ngd3.graph',
    'ngd3.bars',
    'ngd3.lines',
    'ngd3.axis'
]);
angular.module('ngd3.services', [])

.factory('domain', [function() {

    function domain() { }

    domain.getLineDataDomains = function(data) {
        var xVals = [];
        var yVals = [];

        for(var lineName in data) {
            var lineData = data[lineName];
            for(var i in lineData) {
                xVals.push(lineData[i][0]);
                yVals.push(lineData[i][1]);
            }
        }

        return {
            x: domain.getDomain(xVals),
            y: domain.getDomain(yVals)
        };
    }

    domain.getDomain = function(data) {
        return [d3.min(data), d3.max(data)]
    }

    return domain;

}])

.factory('scale', [function() {

    function scale() { }

    var scl = new scale();

    scale.prototype.getTimeScale = function(rangeStart, rangeStop) {
        return getScale(true, rangeStart, rangeStop);
    };

    scale.prototype.getLinearScale = function(rangeStart, rangeStop) {
        return getScale(false, rangeStart, rangeStop);
    };

    function getScale(isTimeScale, rangeStart, rangeStop) {
        var s = (isTimeScale ?
                    d3.time.scale() : d3.scale.linear());
        return s.range([rangeStart, rangeStop]);
    }

    return scl;

}]);