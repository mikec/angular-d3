angular.module('ngd3.axis', ['ngd3.services'])

.directive('axis', ['GraphElement',  function(GraphElement) {

    var autoInc = 0;

    return {
        link: function($scope, $element, $attrs) {

            var id = 'axis_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var domainScope = $attrs.domain;

            var xyAxisNode = d3.select('#' + id);

            var graph = GraphElement.findByChild($element);

            var orientY = $attrs.orientation && 
                            $attrs.orientation.toLowerCase() == 'y';

            $element.addClass('axis');
            $element.addClass(orientY ? 'y' : 'x');

            var xyScale = orientY ? graph.yLinearScale : graph.xLinearScale;

            var xyAxis = d3.svg.axis()
                .scale(xyScale)
                .orient(orientY ? "left" : "bottom");

            var xTrans, yTrans;
            if(!orientY) {
                xTrans = graph.graphHeight - graph.yMargin;
                yTrans = graph.xMargin;
            } else {
                xTrans = graph.yMargin;
                yTrans = graph.xMargin;
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

            function setAxisDomain(domain) {
                if(domain) {
                    if(domain[0] instanceof Date) {
                        xyScale = orientY ? graph.yTimeScale : graph.xTimeScale;
                        xyAxis.scale(xyScale);
                    }
                    xyScale.domain(domain);
                    xyAxisNode.call(xyAxis);
                }
            }

        }
    }

}]);