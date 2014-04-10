angular.module('ngd3.linegraph', ['ngd3.multiline', 'ngd3.services'])

.directive('lineGraph', ['domain', function(domain) {
    return {
        template: '<svg graph x-margin="35" y-margin="20" >' +
                    '<g axis domain="domainX" orientation="x"></g>' +
                    '<g axis domain="domainY" orientation="y"></g>' +
                    '<g multiline></g>' +
                  '</svg>',
        compile: function compile(tElement, tAttrs) {

            var dataScope;

            return {
                pre: function preLink($scope, $element, $attrs) {
                    dataScope = $attrs.lineGraph;
                    if(!dataScope) return;
                    // set the data-scope attribute of the SVG element
                    angular.element($element[0].firstChild)
                        .attr('data-scope', dataScope);
                },
                post: function postLink($scope, $element, $atts) {

                    $scope.$watch(dataScope, function(data) {

                        var domains = domain.getLineDataDomains(data);
                        $scope.domainX = domains.x;
                        $scope.domainY = domains.y;
                        
                    });

                }
            }
        }
    }
}]);