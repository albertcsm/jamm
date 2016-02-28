angular.module('jamm')
.controller('MovieDetailController', function ($scope, MovieService, $stateParams, $state, $uibModal) {
    var movies = MovieService.movies;

    var movieId = $stateParams.id;
    if (movieId) {
        $scope.originalMovie = _.find(movies, { id: movieId });
        $scope.movie = angular.copy($scope.originalMovie);
    }

    $scope.isModified = false;

    $scope.$watch('movie', function (value) {
        $scope.isModified = !angular.equals(value, $scope.originalMovie);
    }, true);

    $scope.save = function() {
        $scope.originalMovie = MovieService.updateMovie($scope.originalMovie.id, $scope.movie);
        $scope.movie = angular.copy($scope.originalMovie);
        $scope.isModified = false;
    };

    $scope.discard = function() {
        $scope.movie = angular.copy($scope.originalMovie);
        $scope.isModified = false;
    };

    $scope.delete = function () {
        _.remove(movies, { id: $scope.originalMovie.id });
        $('#confirmDeleteModal').on('hidden.bs.modal', function () {
            $scope.originalMovie = null;
            $scope.movie = null;
            $state.go('movies');
        });
        $('#confirmDeleteModal').modal('hide');
    };

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
        if ($scope.movie && $scope.isModified) {
            event.preventDefault();
            $uibModal.open({
                templateUrl: 'unsaved-change-modal-template',
                controller: 'UnsavedChangeModalController'
            }).result.then(function (saving) {
                if (saving) {
                    $scope.save();
                } else {
                    $scope.discard();
                }
                $state.go(toState, toParams);
            });
        }
    });

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

})
.controller('UnsavedChangeModalController', function ($scope, $uibModalInstance) {
    $scope.saveAndProceed = function () {
        $uibModalInstance.close(true);
    };

    $scope.proceedWithoutSave = function () {
        $uibModalInstance.close(false);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
