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
                                '<a ng-click="scrollTo(t.id)" ' +
                                    'ng-class="{active: t.active}" ' +
                                    'id="item_{{t.id}}">{{t.title}}</a>' +
                            '</li>' +
                        '</ul>' +
                    '</li>' +
                '</ul>' +
            '</div>',
        link: function($scope, $element, $attrs) {

            var headings = [];
            var activeTopic;
            $scope.categories = [];

            $element.find('h1').each(function(i, h1) {
                var h1 = $(h1);
                var topics = [];
                h1.parent().find('h2').each(function(i, h2) {
                    var h2 = $(h2);
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

            updateHeaderPositions();
            setActiveMenuItem();

            $(window).resize(function() {
                updateHeaderPositions();
            });

            $(window).scroll(function() {
                var itemSet = setActiveMenuItem();
                if(itemSet) $scope.$apply();
            });

            $scope.scrollTo = function(id) {
                $location.hash(id);
                $anchorScroll();
            }

            function updateHeaderPositions() {
                headings = $('h2').map(function(i, el) {
                    return {
                        top: $(el).offset().top,
                        id: el.id
                    };
                });
            }

            function setActiveMenuItem() {
                var h = getCurrentHeading();
                if(!h) return;

                if(activeTopic) {
                    delete activeTopic.active;
                }

                for(var i in $scope.categories) {
                    for(var j in $scope.categories[i].topics) {
                        var t = $scope.categories[i].topics[j];
                        if(t.id == h.id) {
                            activeTopic = t;
                            activeTopic.active = true;
                            return true;
                        }
                    }
                }
            }

            function getCurrentHeading() {
                var h;
                var top = $(window).scrollTop();
                var i = headings.length;
                while (i--) {
                    h = headings[i];
                    if (top >= h.top) return h;
                }
                return h;
            }

        }
    }
}]);