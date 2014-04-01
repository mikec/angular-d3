angular.module('ngd3.axis', ['ngd3.services'])

.directive('axis', ['graph', function(graph) {

    var autoInc = 0;

    return {
        link: function($scope, $element, $attrs) {

            var id = 'axis_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var domainScope = $attrs.domain;

            var xyAxisNode = d3.select('#' + id);
            var SVG = graph.getSVG($element);

            var orientY = $attrs.orientation && 
                            $attrs.orientation.toLowerCase() == 'y';

            $element.addClass('axis');
            $element.addClass(orientY ? 'y' : 'x');

            var xyScale = orientY ? SVG.yLinearScale : SVG.xLinearScale;

            var xyAxis = d3.svg.axis()
                .scale(xyScale)
                .orient(orientY ? "left" : "bottom");

            var xTrans, yTrans;
            if(!orientY) {
                xTrans = SVG.graphHeight - SVG.yMargin;
                yTrans = SVG.xMargin;
            } else {
                xTrans = SVG.yMargin;
                yTrans = SVG.xMargin;
            }
            xyAxisNode
                .attr("transform", 
                        "translate(" + yTrans + "," + xTrans + ")");

            xyAxisNode.call(xyAxis);

            if(domainScope) {
                // domain is defined directly by the domain attribute 
                $scope.$watchCollection(domainScope, function(d) {  
                    setAxisDomain(d);
                });
            }

            if(SVG.dataScope) {
                // domain can be calculated from the current data-scope.
                // (data-scope is defined as an attribute of the parent SVG element)
                $scope.$watch(SVG.dataScope, function(data) {
                    var domains = graph.getDomains(data);
                    setAxisDomain(orientY ? domains.y : domains.x);
                });
            }

            function setAxisDomain(domain) {
                if(domain) {
                    if(domain[0] instanceof Date) {
                        xyScale = orientY ? SVG.yTimeScale : SVG.xTimeScale;
                        xyAxis.scale(xyScale);
                    }
                    xyScale.domain(domain);
                    xyAxisNode.call(xyAxis);
                }
            }

        }
    }

}]);