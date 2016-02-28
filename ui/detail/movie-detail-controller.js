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
        $scope.originalMovie = MovieService.updateMovie($scope.originalMovie.id, $scope.movie);
        $scope.movie = _.cloneDeep($scope.originalMovie);
        $scope.isModified = false;
    };

    $scope.discard = function() {
        $scope.movie = _.cloneDeep($scope.originalMovie);
    };

    $scope.delete = function () {
        _.remove(movies, { id: $scope.originalMovie.id });
        $('#confirmDeleteModal').on('hidden.bs.modal', function () {
            $state.go('movies');
        });
        $('#confirmDeleteModal').modal('hide');
    };

    $scope.selectedVideoIndex = 0;

    $scope.selectVideo = function (index) {
        $scope.selectedVideoIndex = index;
        angular.element('#videoPlayer').attr('src', $scope.movie.storage.videos[$scope.selectedVideoIndex].file);
    };

    $scope.initVideoPlayer = function () {
        $scope.selectVideo($scope.selectedVideoIndex);
        var player = new MediaElementPlayer('#videoPlayer', {
            videoWidth: '100%',
            videoHeight: '100%',
            success: function(mediaElement, originalNode) {
                // do things
            }
        });
    };

});
