ngd3.directive('graph', ['scale',  function(scale) {

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