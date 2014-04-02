angular.module('ngd3.graph', ['ngd3.services'])

.directive('graph', ['GraphElement',  function(GraphElement) {

    return {
        compile: function compile(tElement, tAttrs) {
            return {
                pre: function preLink($scope, $element, $attrs) {
                    var graphElem = new GraphElement($element);
                }
            }
        }
    }

}]);