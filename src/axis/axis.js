angular.module('ngd3.axis', [])

.directive('axis', [function() {

    var autoInc = 0;
    var defaultMarginX = 30;
    var defaultMarginY = 20;

    return {
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

            var rangeStart = orientY ? 
                                parentSvg.prop('offsetHeight') - yMargin : 0;
            var rangeStop = orientY ? 0 : 
                                parentSvg.prop('offsetWidth') - xMargin;

            var xy = d3.scale.linear()
                .range([rangeStart, rangeStop]);

            var xyAxis = d3.svg.axis()
                .scale(xy)
                .orient(orientY ? "left" : "bottom");

            var xTrans, yTrans;
            if(!orientY) {
                xTrans = parentSvg.prop('offsetHeight') - xMargin;
                yTrans = yMargin / 2;
            } else {
                xTrans = 0;
                yTrans = yMargin;
            }
            xyAxisNode
                .attr("transform", "translate(" + 
                            yTrans + "," + xTrans + 
                        ")");

            xyAxisNode
                .call(xyAxis);

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