angular.module('ngd3.graph', ['ngd3.services'])

.directive('graph', [function() {

    var autoInc = 0;

    return {
        link: function($scope, $element, $attrs) {

            var id = 'graph_' + autoInc;
            $element.attr('id', id);
            autoInc++;

        }
    }

}]);