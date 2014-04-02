angular.module('ngd3.axis', ['ngd3.services'])

.directive('axis', ['DataSet', 'SvgElement',  function(DataSet, SvgElement) {

    var autoInc = 0;

    return {
        link: function($scope, $element, $attrs) {

            var id = 'axis_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var domainScope = $attrs.domain;

            var xyAxisNode = d3.select('#' + id);

            var parentSvg = SvgElement.findSvgParent($element);
            var svg = new SvgElement(parentSvg);

            var orientY = $attrs.orientation && 
                            $attrs.orientation.toLowerCase() == 'y';

            $element.addClass('axis');
            $element.addClass(orientY ? 'y' : 'x');

            var xyScale = orientY ? svg.yLinearScale : svg.xLinearScale;

            var xyAxis = d3.svg.axis()
                .scale(xyScale)
                .orient(orientY ? "left" : "bottom");

            var xTrans, yTrans;
            if(!orientY) {
                xTrans = svg.graphHeight - svg.yMargin;
                yTrans = svg.xMargin;
            } else {
                xTrans = svg.yMargin;
                yTrans = svg.xMargin;
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

            if(svg.dataScope) {
                // domain can be calculated from the current data-scope.
                // (data-scope is defined as an attribute of the parent svg element)
                $scope.$watch(svg.dataScope, function(data) {
                    var dataSet = new DataSet(data);
                    setAxisDomain(orientY ? dataSet.y : dataSet.x);
                });
            }

            function setAxisDomain(domain) {
                if(domain) {
                    if(domain[0] instanceof Date) {
                        xyScale = orientY ? svg.yTimeScale : svg.xTimeScale;
                        xyAxis.scale(xyScale);
                    }
                    xyScale.domain(domain);
                    xyAxisNode.call(xyAxis);
                }
            }

        }
    }

}]);