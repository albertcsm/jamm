angular.module('jamm')
.controller('MovieDetailController', function ($scope, $stateParams, $state, $uibModal, MovieService, VolumeFile, Volume, MediaInfoService) {

    var movieId = $stateParams.id;

    $scope.movie = null;
    $scope.movieModelInEdit = null;
    $scope.isModified = false;
    $scope.mediaInfo = null;
    $scope.selectedVideo = null;
    $scope.treeOpts = {
        dirSelectable: false
    };
    
    if (movieId) {
        $scope.movie = MovieService.get({ id: movieId }, function () {
            $scope.movieModelInEdit = angular.copy($scope.movie);

            var storageInfo = $scope.movie.storage;
            if (storageInfo) {
                $scope.mediaInfo = MediaInfoService.getMediaInfo(storageInfo.volume, storageInfo.path, function (info) {
                    if (info.videos.length) {
                        $scope.selectVideo(info.videos[0]);
                    }
                });

                var movieNode = {
                    name: storageInfo.path,
                    type: 'directory',
                    children: []
                };

                var volumeNode = {
                    name: storageInfo.volume,
                    type: 'directory',
                    children: [ movieNode ]
                };

                $scope.movieDirectoryTree = [ volumeNode ];

                $scope.expandedTreeNodes = [ volumeNode ];

                VolumeFile.query({ volumeId: storageInfo.volume, dir: storageInfo.path }, function (volumeFiles) {
                    movieNode.children = volumeFiles;
                    $scope.expandedTreeNodes.push(movieNode);
                });

                Volume.get({ id : storageInfo.volume }, function (volumeInfo) {
                    volumeNode.name = volumeInfo.name;
                });
            }
        });
    }

    $scope.$watch('movieModelInEdit', function (value) {
        $scope.isModified = !angular.equals(value, $scope.movie);
    }, true);

    $scope.getCoverUrl = function (movie) {
        if (movie && movie.storage) {
            var storage = movie.storage;
            return 'api/volumes/' + storage.volume + '/files/' + encodeURIComponent(storage.path + '/' + storage.cover);
        } else {
            return null;
        }
    };

    $scope.save = function (callback) {
        MovieService.update($scope.movie._id, $scope.movieModelInEdit, function () {
            $scope.movie = angular.copy($scope.movieModelInEdit);
            $scope.isModified = false;
            if (callback) {
                callback(null);
            }
        });
    };

    $scope.discard = function () {
        $scope.movieModelInEdit = angular.copy($scope.movie);
        $scope.isModified = false;
    };

    $scope.confirmDeleteRecord = function () {
        $uibModal.open({
            templateUrl: 'confirm-delete-modal-template',
            controller: 'ConfirmDeleteModalController',
            resolve: {
                deleteFiles : function () { return false; }
            },
            scope: $scope
        }).result.then(function () {
            $scope.deleteRecord(function () {
                $state.go('movies.list');
            });
        });
    };

    $scope.confirmDeleteFilesAndRecord = function () {
        $uibModal.open({
            templateUrl: 'confirm-delete-modal-template',
            controller: 'ConfirmDeleteModalController',
            resolve: {
                deleteFiles : function () { return true; }
            },
            scope: $scope
        }).result.then(function () {
            $scope.deleteFiles(function () {
                $scope.deleteRecord(function () {
                    $state.go('movies.list');
                });
            });
        });
    };

    $scope.deleteRecord = function (callback) {
        MovieService.delete({ id: $scope.movie._id }, function () {
            $scope.movie = null;
            callback();
        });
    };

    $scope.deleteFiles = function (callback) {
        var storageInfo = $scope.movie.storage;
        VolumeFile.delete({ volumeId: storageInfo.volume, path: storageInfo.path }, function () {
            callback();
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
                    $scope.save(function (newMovieModel) {
                        $state.go(toState, toParams);
                    });
                } else {
                    $scope.discard();
                    $state.go(toState, toParams);
                }
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
