angular.module('ngd3.linegraph', ['ngd3.multiline'])

.directive('lineGraph', [function() {
    return {
        template: '<svg id="test" x-margin="35" y-margin="20" data-scope="">' +
                    '<g axis orientation="x"></g>' +
                    '<g axis orientation="y"></g>' +
                    '<g multiline></g>' +
                  '</svg>',
        compile: function compile(tElement, tAttrs) {
            return {
                pre: function preLink($scope, $element, $attrs) {
                    var dataScope = $attrs.lineGraph;
                    if(!dataScope) return;
                    // set the data-scope attribute of the SVG element
                    angular.element($element[0].firstChild)
                        .attr('data-scope', dataScope);
                }
            }
        }
    }
}]);