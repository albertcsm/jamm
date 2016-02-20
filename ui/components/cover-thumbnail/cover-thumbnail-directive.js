angular.module('jamm.coverThumbnail', [])
.directive('coverThumbnail', function($state) {

    function link(scope, element, attrs) {
        //scope.name = 'Star War';
    }

    return {
        restrict: "E",
        scope: {
            movie: '=movie'
        },
        templateUrl: 'components/cover-thumbnail/cover-thumbnail.html',
        link: link
    };
});
