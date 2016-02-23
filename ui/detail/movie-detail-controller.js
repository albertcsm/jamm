angular.module('jamm')
.controller('MovieDetailController', function ($scope, MovieService, $stateParams, $state) {
    var movies = MovieService.movies;

    var movieId = $stateParams.id;
    if (movieId) {
        $scope.originalMovie = _.find(movies, { id: movieId });
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

    $scope.delete = function () {
        _.remove(movies, { id: $scope.originalMovie.id });
        $('#confirmDeleteModal').on('hidden.bs.modal', function () {
            $state.go('movies', null, { location: 'replace' });
        });
        $('#confirmDeleteModal').modal('hide');
    };

});
