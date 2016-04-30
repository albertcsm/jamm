angular.module('jamm.movieDetailForm', [ ])
.directive('movieDetailForm', function() {

    return {
        restrict: 'E',
        scope: {
            model: '=ngModel',
            mediaInfo: '='
        },
        templateUrl: 'components/movie-detail-form/movie-detail-form.html',
        link: function (scope, element, attrs) {

            scope.getCoverUrl = function () {
                if (scope.model && scope.model.storage && scope.model.storage.cover) {
                    var storage = scope.model.storage;
                    return 'api/volumes/' + storage.volume + '/files/' + encodeURIComponent(storage.path + '/' + storage.cover);
                } else {
                    return null;
                }
            };

            scope.setCover = function (imageName) {
                scope.model.storage.cover = imageName;
            }

            scope.addNewActor = function () {
                scope.model.actors.push({'name': ''});
            }

        }
    };

});
