angular.module('ngd3.linegraph', ['ngd3.lines', 'ngd3.services'])

.directive('lineGraph', ['domain', function(domain) {
    return {
        template: '<svg graph x-margin="35" y-margin="20" >' +
                    '<g axis domain="domainX" orientation="x"></g>' +
                    '<g axis domain="domainY" orientation="y"></g>' +
                    '<g lines="lineDataScope" class="lines"></g>' +
                  '</svg>',
        compile: function compile(tElement, tAttrs) {

            var dataScope;

            return {
                pre: function preLink($scope, $element, $attrs) {
                    dataScope = $attrs.lineGraph;
                },
                post: function postLink($scope, $element, $atts) {

                    $scope.$watch(dataScope, function(data) {

                        $scope.lineDataScope = data;

                        var domains = domain.getLineDataDomains(data);
                        $scope.domainX = domains.x;
                        $scope.domainY = domains.y;
                        
                    });

                }
            }
        }
    }
}]);