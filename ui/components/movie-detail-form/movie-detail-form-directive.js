angular.module('jamm.movieDetailForm', [ ])
.directive('movieDetailForm', function() {

    return {
        restrict: 'E',
        scope: {
            modelValue: '=ngModel',
            mediaInfo: '=',
            onSave: '&',
            onCancel: '&',
            onDelete: '&'
        },
        templateUrl: 'components/movie-detail-form/movie-detail-form.html',
        link: function (scope, element, attrs) {
            function init(model) {
                scope.movie = angular.copy(model);
                if (!scope.movie.actors) {
                    scope.movie.actors = [];
                }
                scope.originalMovie = angular.copy(scope.movie);
                scope.isModified = false;
            }

            if (scope.modelValue) {
                if (scope.modelValue.$promise) {
                    scope.modelValue.$promise.then(function (value) {
                        init(value);
                    });
                } else {
                    init(scope.modelValue);
                }
            }

            scope.mediaInfo = scope.mediaInfo;

            scope.getCoverUrl = function () {
                if (scope.movie && scope.movie.storage && scope.movie.storage.cover) {
                    var storage = scope.movie.storage;
                    return 'api/volumes/' + storage.volume + '/files/' + encodeURIComponent(storage.path + '/' + storage.cover);
                } else {
                    return null;
                }
            };

            scope.setCover = function (imageName) {
                scope.movie.storage.cover = imageName;
            }

            scope.$watch('movie', function (value) {
                scope.isModified = !angular.equals(value, scope.originalMovie);
            }, true);

            scope.save = function() {
                scope.onSave({
                    model: scope.movie,
                    savedCallback: function () {
                        scope.originalMovie = angular.copy(scope.movie);
                        scope.isModified = false;
                    }
                });
            };

            scope.discard = function() {
                scope.movie = angular.copy(scope.originalMovie);
                scope.isModified = false;
            };

            scope.cancel = function() {
                scope.onCancel();
            };

            scope.deleteRecord = function() {
                scope.onDelete({ deleteFiles : false });
            };

            scope.deleteFilesAndRecord = function() {
                scope.onDelete({ deleteFiles : true });
            };
        }
    };

});
