angular.module('jamm')
.controller('MovieListController', function ($scope, Movie, $stateParams) {
    $scope.movies = Movie.query();
    $scope.displayStyle = 'list';
    $scope.sortParam = {
        field: 'releaseDate',
        reversed: true
    };
    $scope.searchString = '';

    $scope.getCoverUrl = function (movie) {
        var storage = movie.storage;
        return 'api/volumes/' + storage.volume + '/files/' + encodeURIComponent(storage.path + '/' + storage.cover);
    };
});
