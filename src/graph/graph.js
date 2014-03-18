angular.module('ngd3.graph', ['ngd3.services'])

.directive('graph', [function() {

    var autoInc = 0;

    return {
        template: '<svg>' +
                    '<g class="container">' +
                        '<g class="x axis"></g>' +
                        '<g class="y axis"></g>' +
                    '</g>' +
                  '</svg>',
        link: function($scope, $element, $attrs) {

            var id = 'graph_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var svgNode = d3.select('#'+id).select("svg");
            var containerNode = svgNode.select('.container');
            var xAxisNode = containerNode.select('.x.axis');
            var yAxisNode = containerNode.select('.y.axis');

            var margin = {top: 20, right: 50, bottom: 30, left: 50};
            var hMargin = margin.right + margin.left;
            var vMargin = margin.top + margin.bottom;

            var width = $element.prop('offsetWidth');
            var height = $element.prop('offsetHeight');

            var x = d3.time.scale()
                .range([0, width - hMargin]);

            var y = d3.scale.linear()
                .range([height - vMargin, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            svgNode
                .attr("width", width)
                .attr("height", height);

            containerNode
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            xAxisNode
                .attr("transform", "translate(0," + (height - vMargin) + ")")
                .call(xAxis);

            yAxisNode
                .call(yAxis);

        }
    }

}]);