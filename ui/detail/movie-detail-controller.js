angular.module('jamm')
.controller('MovieDetailController', function ($scope, Movie, $stateParams, $state, $uibModal) {

    var movieId = $stateParams.id;

    $scope.selectedVideoIndex = null;

    if (movieId) {
        $scope.movie = Movie.get({ id: movieId }, function () {
            $scope.originalMovie = angular.copy($scope.movie);
            if ($scope.movie.storage && $scope.movie.storage.videos) {
                $scope.selectVideo(0);
            }
        });
    }

    $scope.isModified = false;

    $scope.$watch('movie', function (value) {
        $scope.isModified = !angular.equals(value, $scope.originalMovie);
    }, true);

    $scope.save = function() {
        if ($scope.movie._id == $scope.originalMovie._id) {
            $scope.movie.$update(function () {
                $scope.originalMovie = angular.copy($scope.movie);
                $scope.isModified = false;
            });
        } else {
            Movie.create($scope.movie, function () {
                if ($scope.originalMovie._id) {
                    Movie.delete({ id: $scope.originalMovie._id }, function () {
                        $scope.originalMovie = angular.copy($scope.movie);
                        $scope.isModified = false;
                    });
                } else {
                    $scope.originalMovie = angular.copy($scope.movie);
                    $scope.isModified = false;
                }
            });
        }
    };

    $scope.discard = function() {
        $scope.movie = angular.copy($scope.originalMovie);
        $scope.isModified = false;
    };

    $scope.delete = function () {
        Movie.delete({ id: $scope.originalMovie._id }, function () {
            $('#confirmDeleteModal').on('hidden.bs.modal', function () {
                $scope.originalMovie = null;
                $scope.movie = null;
                $state.go('movies');
            });
            $('#confirmDeleteModal').modal('hide');
        });
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

    $scope.selectVideo = function (index) {
        $scope.selectedVideoIndex = index;
        angular.element('#videoPlayer').attr('src', $scope.movie.storage.videos[$scope.selectedVideoIndex].file);

        new MediaElementPlayer('#videoPlayer', {
            videoWidth: '100%',
            videoHeight: '100%',
            success: function(mediaElement, originalNode) {
            },
            error : function(mediaElement) {
                console.error('medialement problem is detected: %o', mediaElement);
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
