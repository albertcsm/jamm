angular.module('jamm')
.controller('MovieDetailController', function ($scope, MovieService, $stateParams) {
    $scope.movies = MovieService.movies;

    var movieId = $stateParams.id;
    if (movieId) {
        $scope.originalMovie = _.find($scope.movies, { id: movieId });
        $scope.movie = _.cloneDeep($scope.originalMovie);
    }

    $scope.isModified = false;

    $scope.$watch('movie', function (value) {
        $scope.isModified = !_.isEqual(value, $scope.originalMovie);
    }, true);

    $scope.save = function() {
        _.assign($scope.originalMovie, $scope.movie);
        $scope.isModified = false;
    };

    $scope.discard = function() {
        $scope.movie = _.cloneDeep($scope.originalMovie);
    };

});
