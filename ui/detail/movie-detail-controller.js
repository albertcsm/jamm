angular.module('jamm')
.controller('MovieDetailController', function ($scope, $stateParams, $state, $uibModal, MovieService, VolumeFile, MediaInfoService) {

    var movieId = $stateParams.id;

    $scope.movie = null;
    $scope.mediaInfo = null;
    $scope.selectedVideo = null;

    if (movieId) {
        $scope.movie = MovieService.get({ id: movieId }, function () {
            var storageInfo = $scope.movie.storage;
            if (storageInfo) {
                $scope.mediaInfo = MediaInfoService.getMediaInfo(storageInfo.volume, storageInfo.path, function (info) {
                    if (info.videos.length) {
                        $scope.selectVideo(info.videos[0]);
                    }
                });
            }

            $scope.movieFiles = [
                {
                    name: storageInfo.path,
                    type: 'directory',
                    children: VolumeFile.query({ volumeId: storageInfo.volume, dir: storageInfo.path })
                }
            ];
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
            MovieService.update(model._id, model, function () {
                $scope.movie = angular.copy(model);
                savedCallback();
            });
        } else {
            MovieService.create(model, function () {
                MovieService.delete({ id: $scope.movie._id }, function () {
                    $scope.movie = angular.copy(model);
                    savedCallback();
                });
            });
        }
    };

    $scope.confirmDelete = function (deleteFiles) {
        $uibModal.open({
            templateUrl: 'confirm-delete-modal-template',
            controller: 'ConfirmDeleteModalController',
            resolve: {
                deleteFiles : function () { return deleteFiles; }
            },
            scope: $scope
        }).result.then(function () {
            $scope.delete(deleteFiles);
        });
    };

    $scope.delete = function (deleteFiles) {
        function deleteRecord() {
            MovieService.delete({ id: $scope.movie._id }, function () {
                $scope.movie = null;
                $state.go('movies.list');
            });
        }

        if (deleteFiles) {
            var storageInfo = $scope.movie.storage;
            VolumeFile.delete({ volumeId: storageInfo.volume, path: storageInfo.path }, function () {
                deleteRecord();
            });
        } else {
            deleteRecord();
        }
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

    $scope.selectVideo = function (video, play) {
        $scope.selectedVideo = video;
        player.setSrc(video.src);
        player.load();
    };

    $scope.playVideo = function (video) {
        if (video) {
            $scope.selectVideo(video);
        }
        player.play();
    }

    $scope.$on('$destroy', function () {
        player.setSrc('');
        player.load();
        player = null;

        if ($scope.mediaInfo) {
            $scope.mediaInfo.cancel();
        }
    });

    $scope.getAbsoluteUrl = (function() {
        var a;
        return function(url) {
            if (!a) a = document.createElement('a');
            a.href = url;
            return a.href;
        };
    })();

    $scope.discardClick = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
    }
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
.controller('ConfirmDeleteModalController', function ($scope, $uibModalInstance, deleteFiles) {
    $scope.deleteFiles = deleteFiles;

    $scope.proceedToDelete = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
