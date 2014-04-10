angular.module('ngd3.bars', ['ngd3.services'])

.directive('bars', ['DataSet', 'GraphElement', 
function(DataSet, GraphElement) {

    var autoInc = 0;

    return {

        link: function($scope, $element, $attrs) {

            var id = 'bars_' + autoInc;
            $element.attr('id', id);
            autoInc++;

            var graph = GraphElement.findByChild($element);

            var elemNode = d3.select('#'+id);
            
        }

    }

}]);