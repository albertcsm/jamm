angular.module('jamm')
.controller('MovieListController', function ($scope, Movie) {
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
        if (toState.name == 'movies.list') {
            Movie.query(function (value) {
                $scope.movies = value;
            });
        }
    });

    $scope.movies = Movie.query();

    $scope.displayStyle = 'thumbnail';
    $scope.sortParam = {
        field: 'releaseDate',
        reversed: true
    };
    $scope.sortDescription = null;

    $scope.$watch('sortParam', function (value) {
        if (value.field == 'releaseDate' && value.reversed == true) {
            $scope.sortDescription = 'Latest';
        } else if (value.field == 'releaseDate' && value.reversed == false) {
            $scope.sortDescription = 'Earliest';
        } else if (value.field == 'name') {
            $scope.sortDescription = 'Sort by name';
        } else {
            $scope.sortDescription = 'Sorting';
        }
    }, true);

    $scope.searchString = '';

    $scope.getCoverUrl = function (movie) {
        var storage = movie.storage;
        if (storage && storage.cover) {
            return 'api/volumes/' + storage.volume + '/files/' + encodeURIComponent(storage.path + '/' + storage.cover);
        } else {
            return null;
        }
    };
});
