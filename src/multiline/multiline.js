angular.module('ngd3.multiline', [])

.directive('multiline', [function() {

    var autoInc = 0;

    return {

        link: function($scope, $element, $attrs) {

            var id = 'multiline_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var dataCollection = $attrs.multiline;
            if(!dataCollection) return;

            var svg = getParentSVG();

            $scope.$watch(dataCollection, function(data) {

                var color = d3.scale.category10();
                color.domain(data.map(function(ln) { return ln.title; }));

                var line = d3.svg.line()
                    .interpolate("basis") // for curved lines
                    .x(function(d) { return x(d.x); })
                    .y(function(d) { return y(d.y); });

                //var items = svg.selectAll(".item")
                var elemNode = d3.select('#'+id);
                var items = elemNode.selectAll(".item")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "item");

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

            function getParentSVG() {
                var p = $element.parent();
                for(var i=0; i < 25; i++) {
                    if(p[0] && 
                        p[0].tagName && 
                            p[0].tagName.toLowerCase() == 'svg') {
                        return p;
                    } else {
                        p = p.parent();
                    }
                }
                return null;
            }
        }

    }

}]);