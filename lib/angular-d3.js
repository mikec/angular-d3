if (typeof angular === 'undefined') { 
    throw new Error('angular-d3 requires angular.js. https://github.com/angular/angular.js');
}
if (typeof d3 === 'undefined') { 
    throw new Error('angular-d3 requires d3.js. https://github.com/mbostock/d3');
}

var ngd3 = angular.module('ngd3', []);
ngd3.factory('domain', [function() {

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
ngd3.directive('graph', ['scale',  function(scale) {

    var defaultMarginX = 30;
    var defaultMarginY = 20;

    return {
        compile: function (tElement, tAttrs, transclude) {

            function setLayoutData(scope, element) {
                // firefox fix: set svg overflow to visible, because FF sets it to hidden
                element.css('overflow', 'visible');

                // full width, including axis margins
                var svgDims = getSvgElementDimensions(element);
                scope.graphWidth = svgDims.width;
                scope.graphHeight = svgDims.height;
                
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

            function getSvgElementDimensions(svgElement) {
                var dims = { width: 0, height: 0 };
                if(svgElement) {
                    dims.width = getPropValue('offsetWidth');
                    dims.height = getPropValue('offsetHeight');
                }

                function getPropValue(propName) {
                    return svgElement.prop(propName) || 
                                angular.element(svgElement[0].parentElement).prop(propName) ||
                                    0;
                }

                return dims;
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