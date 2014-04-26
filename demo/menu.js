angular.module('menu', [])

.directive('menu', ['$location', '$anchorScroll', 
function($location, $anchorScroll) {
    return {
        transclude: true,
        template:
            '<div>' +
                '<div class="menu-content" ng-transclude></div>' +
                '<ul class="menu">' +
                    '<li ng-repeat="c in categories">' +
                        '{{c.title}}' +
                        '<ul class="sub-menu">' +
                            '<li ng-repeat="t in c.topics">' +
                                '<a ng-click="scrollTo(t.id)">{{t.title}}</a>' +
                            '</li>' +
                        '</ul>' +
                    '</li>' +
                '</ul>' +
            '</div>',
        link: function($scope, $element, $attrs) {

            $scope.categories = [];

            angular.forEach($element.find('h1'), function(h1, i) {
                var h1 = angular.element(h1);
                var topics = [];
                angular.forEach(h1.parent().find('h2'), function(h2, i) {
                    var h2 = angular.element(h2);
                    var id = h2.html().replace(' ', '_');
                    h2.attr('id', id);
                    topics.push({
                        title: h2.html(),
                        id: id
                    });
                });
                $scope.categories.push({
                    title: h1.html(),
                    topics: topics
                });
            });

            $scope.scrollTo = function(id) {
                $location.hash(id);
                $anchorScroll();
            }

            /*.forEach(function(i, el) {

                if(!el.id) {
                    el.id = el.html().replace(' ', '_');
                }

                return {
                    top: angular.element(el).offset().top,
                    id: el.id
                }

            });*/

        }
    }
}]);