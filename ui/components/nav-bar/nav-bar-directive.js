angular.module('jamm.navBar', [])
.directive('navBar', function($state) {

    function link(scope, element, attrs) {
        scope.activeNavItem = $state.current.name.replace(/\/.*/, '');
    }

    return {
        restrict: "E",
        templateUrl: 'components/nav-bar/nav-bar.html',
        link: link
    };
});
