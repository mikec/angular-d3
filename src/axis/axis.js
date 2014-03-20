angular.module('ngd3.axis', [])

.directive('axis', [function() {

    var autoInc = 0;
    var defaultMarginX = 30;
    var defaultMarginY = 20;

    return {
        scope: {
            domain: '='
        },
        link: function($scope, $element, $attrs) {

            var id = 'axis_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var xyAxisNode = d3.select('#' + id);
            var parentSvg = getParentSVG();

            var orientY = $attrs.orientation && 
                            $attrs.orientation.toLowerCase() == 'y';

            $element.addClass('axis');
            $element.addClass(orientY ? 'y' : 'x');

            var xMargAttr = parentSvg.attr('x-margin');
            var xMargin = xMargAttr ? parseInt(xMargAttr) : defaultMarginX;

            var yMargAttr = parentSvg.attr('y-margin');
            var yMargin = yMargAttr ? parseInt(yMargAttr) : defaultMarginY;

            var rStart = orientY ? 
                parentSvg.prop('offsetHeight') - (yMargin * 2) : 0;
            var rStop = orientY ? 0 : 
                parentSvg.prop('offsetWidth') - (xMargin * 2);

            var xyScale = getScale(false, rStart, rStop);

            var xyAxis = d3.svg.axis()
                .scale(xyScale)
                .orient(orientY ? "left" : "bottom");

            var xTrans, yTrans;
            if(!orientY) {
                xTrans = parentSvg.prop('offsetHeight') - yMargin;
                yTrans = xMargin;
            } else {
                xTrans = yMargin;
                yTrans = xMargin;
            }
            xyAxisNode
                .attr("transform", 
                        "translate(" + yTrans + "," + xTrans + ")");

            xyAxisNode.call(xyAxis);

            $scope.$watchCollection('domain', function(d) {  
                if(d) {
                    if(d[0] instanceof Date) {
                        xyScale = getScale(true, rStart, rStop);
                        xyAxis.scale(xyScale);
                    }
                    xyScale.domain(d);
                    xyAxisNode.call(xyAxis);
                }
            });

            function getScale(isTimeScale, rangeStart, rangeStop) {
                var s = (isTimeScale ?
                            d3.time.scale() : d3.scale.linear());
                return s.range([rangeStart, rangeStop]);
            }

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