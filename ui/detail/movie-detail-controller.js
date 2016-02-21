angular.module('jamm')
.controller('MovieDetailController', function ($scope, MovieService, $stateParams) {
    $scope.movies = MovieService.movies;

    var movieId = $stateParams.id;
    if (movieId) {
        $scope.movie = _.find($scope.movies, { id: movieId });
    }

    $scope.uiSortableOptions = {
        handle: '.ui-sortable-handle'
    };

});
