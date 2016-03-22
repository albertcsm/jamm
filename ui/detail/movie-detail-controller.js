angular.module('jamm')
.controller('MovieDetailController', function ($scope, $stateParams, $state, $uibModal, Movie, VolumeFile, MediaInfoService) {

    var movieId = $stateParams.id;

    $scope.movie = null;
    $scope.mediaInfo = null;
    $scope.selectedVideo = null;

    if (movieId) {
        $scope.movie = Movie.get({ id: movieId }, function () {
            var storageInfo = $scope.movie.storage;
            if (storageInfo) {
                $scope.mediaInfo = MediaInfoService.getMediaInfo(storageInfo.volume, storageInfo.path, function (info) {
                    if (info.videos.length) {
                        $scope.selectVideo(info.videos[0]);
                    }
                });
            }

            $scope.movieFiles = VolumeFile.query({ volumeId: storageInfo.volume, dir: storageInfo.path });
        });
    }

    $scope.getCoverUrl = function (movie) {
        if (movie && movie.storage) {
            var storage = movie.storage;
            return 'api/volumes/' + storage.volume + '/files/' + encodeURIComponent(storage.path + '/' + storage.cover);
        } else {
            return null;
        }
    };

    $scope.save = function(model, savedCallback) {
        if (model._id == $scope.movie._id) {
            model.$update(function () {
                $scope.movie = angular.copy(model);
                savedCallback();
            });
        } else {
            Movie.create(model, function () {
                Movie.delete({ id: $scope.movie._id }, function () {
                    $scope.movie = angular.copy(model);
                    savedCallback();
                });
            });
        }
    };

    $scope.confirmDelete = function () {
        $uibModal.open({
            templateUrl: 'confirm-delete-modal-template',
            controller: 'ConfirmDeleteModalController',
            scope: $scope
        }).result.then(function () {
            $scope.delete();
        });
    };

    $scope.delete = function () {
        Movie.delete({ id: $scope.movie._id }, function () {
            $scope.movie = null;
            $state.go('movies');
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

    $scope.initPlayer = function () {
        player = new MediaElementPlayer('#videoPlayer', {
            videoWidth: '100%',
            videoHeight: '100%',
            type: 'video/mp4',
            success: function(mediaElement, originalNode) {
            },
            error : function(mediaElement) {
                if (player) {
                    console.error('medialement problem is detected: %o', mediaElement);
                }
            }
        });
    };

    $scope.selectVideo = function (video) {
        $scope.selectedVideo = video;
        player.setSrc(video.src);
        player.load();
        player.play();
    };

    $scope.$on('$destroy', function () {
        player.setSrc('');
        player.load();
        player = null;

        if ($scope.mediaInfo) {
            $scope.mediaInfo.cancel();
        }
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
})
.controller('ConfirmDeleteModalController', function ($scope, $uibModalInstance) {
    $scope.proceedToDelete = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
