angular.module('ngd3.linegraph', [])

.directive('lineGraph', [function() {

    var autoInc = 0;

    return {
        scope: {
            data: '=',
            propertyX: '@',
            propertyY: '@'
        },
        link: function($scope, $element, $attrs) {

            var propX = $scope.propertyX;
            var propY = $scope.propertyY;
            if(!propX || !propY) {
                throw "missing required attribute";
            }

            var id = 'line_graph_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var margin = {top: 20, right: 50, bottom: 30, left: 50},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var parseDate = d3.time.format("%d-%b-%y").parse;

            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var color = d3.scale.category10();

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = d3.svg.line()
                .interpolate("basis") // for curved lines
                .x(function(d) { return x(d[propX]); })
                .y(function(d) { return y(d[propY]); });

            var svg = d3.select('#'+id).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("g")
                .attr("class", "x axis");

            svg.append("g")
                .attr("class", "y axis")
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Value");

            var initialRender = true;

            $scope.$watch('data', function(data) {

                var lines = [];
                for(var lineTitle in data) {
                    lines.push({
                        title: lineTitle,
                        points: data[lineTitle]
                    });
                }

                color.domain(lines.map(function(ln) { return ln.title; }));

                x.domain([
                    d3.min(lines, function(ln) { return d3.min(ln.points, function(v) { return v[propX]; }); }),
                    d3.max(lines, function(ln) { return d3.max(ln.points, function(v) { return v[propX]; }); })
                ]);

                y.domain([
                    d3.min(lines, function(ln) { return d3.min(ln.points, function(v) { return v[propY]; }); }),
                    d3.max(lines, function(ln) { return d3.max(ln.points, function(v) { return v[propY]; }); })
                ]);

                svg.select(".x.axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.select(".y.axis")
                    .call(yAxis);

                items = svg.selectAll(".item")
                    .data(lines)
                    .enter().append("g")
                    .attr("class", "item");

                items.append("path")
                    .attr("class", "line")
                    .style("stroke", function(d) { return color(d.title); })
                items.append("text");

                svg.selectAll(".item")
                    .select("path")
                    .transition()
                    .attr("d", function(d) { 
                        var x = 0;
                        return line(d.points); 
                    });

                var labels = svg.selectAll(".item")
                    .select("text")
                    .datum(function(d) { 
                        return {
                            key: d.title, 
                            val: d.points[d.points.length - 1]
                        }; 
                    });

                if(!initialRender) labels = labels.transition()

                labels
                    .attr("transform", function(d) { return "translate(" + x(d.val[propX]) + "," + y(d.val[propY]) + ")"; })
                    .attr("x", 3)
                    .attr("dy", ".35em")
                    .text(function(d) { return d.key; });

                initialRender = false;

            }, true);

        }
    }

}]);