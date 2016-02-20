angular.module('jamm')
.directive('movieDetail', function($state) {

    function link(scope, element, attrs) {
        //scope.name = 'Star War';
    }

    return {
        restrict: "E",
        scope: {
            movie: '=movie'
        },
        templateUrl: 'detail/movie-detail.html',
        link: link
    };
});
