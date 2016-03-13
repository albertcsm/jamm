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

    $scope.getMediaUrl = function (file) {
        var storage = $scope.movie.storage;
        return 'api/volumes/' + storage.volume + '/files/' + encodeURIComponent(storage.path + '/' + file);
    };

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

    var player = null;

    $scope.selectVideo = function (index) {
        $scope.selectedVideoIndex = index;

        var url = $scope.getMediaUrl($scope.movie.storage.videos[$scope.selectedVideoIndex].file);
        player = new MediaElementPlayer('#videoPlayer', {
            videoWidth: '100%',
            videoHeight: '100%',
            type: 'video/mp4',
            success: function(mediaElement, originalNode) {
                mediaElement.setSrc(url);
                mediaElement.load();
                mediaElement.play();
            },
            error : function(mediaElement) {
                if (player) {
                    console.error('medialement problem is detected: %o', mediaElement);
                }
            }
        });
    };

    $scope.$on('$destroy', function () {
        player.setSrc('');
        player.load();
        player = null;
    });
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
