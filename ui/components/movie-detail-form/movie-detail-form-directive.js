angular.module('jamm.movieDetailForm', [ ])
.directive('movieDetailForm', function() {

    return {
        restrict: 'E',
        scope: {
            modelValue: '=ngModel',
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

            scope.delete = function() {
                scope.onDelete();
            };
        }
    };

});
