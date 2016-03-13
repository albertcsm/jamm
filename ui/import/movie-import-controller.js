angular.module('jamm')
.controller('MovieImportController', function ($scope, $uibModal, Movie, Volume, VolumeFile, MediaInfoService) {

    $scope.volumes = Volume.query(function () {
        var volumeId = $scope.volumes[0]._id;
        $scope.volumes[0].files = VolumeFile.query({ volumeId: volumeId }, function () {
            for (var key in $scope.volumes[0].files) {
                if ($scope.volumes[0].files[key].type == 'directory') {
                    $scope.volumes[0].files[key].children = [ {} ];
                }
            }
        });
    });

    $scope.selectedPath = null;
    $scope.mediaInfo = null;

    $scope.showSelected = function (node, selected) {
        if ($scope.mediaInfo) {
            $scope.mediaInfo.cancel();
        }
        if (selected) {
            $scope.selectedPath = node.path;
            if (node.type == 'directory') {
                $scope.mediaInfo = MediaInfoService.getMediaInfo($scope.volumes[0]._id, node.path);
            } else {
                $scope.mediaInfo = null;
            }   
        } else {
            $scope.mediaInfo = null;
        }
    };

    $scope.showToggle = function(volumeId, node, expanded, $parentNode, $index, $first, $middle, $last, $odd, $even) {
        if (expanded) {
            node.children = VolumeFile.query({ volumeId: volumeId, dir: node.path }, function () {
                for (var key in node.children) {
                    if (node.children[key].type == 'directory') {
                        node.children[key].children = [ {} ];
                    }
                }
            });
        } else {
            node.children = [ {} ];
        }
    };

    $scope.previewVideo = function(url) {
        $uibModal.open({
            size: 'lg',
            templateUrl: 'movie-preview-modal-template',
            resolve: {
                url: function() {
                    return url;
                }
            },
            controller: 'MoviePreviewModalController'
        }).result.then(function () {
            
        });
    };

    $scope.import = function() {
        $uibModal.open({
            size: 'lg',
            templateUrl: 'movie-info-modal-template',
            controller: 'MovieImportModalController',
            resolve: {
                volumeId: function() { return $scope.volumes[0]._id; },
                path: function() { return $scope.selectedPath; }
            }
        }).result.then(function () {
            
        });
    };

    $scope.$on('$destroy', function () {
        if ($scope.mediaInfo) {
            $scope.mediaInfo.cancel();
        }
    });
})
.controller('MovieImportModalController', function ($scope, $uibModalInstance, Movie, volumeId, path) {
    $scope.movie = {
        storage: {
            volume: volumeId,
            path: path
        }
    };

    $scope.save = function () {
        Movie.create($scope.movie, function () {
            $uibModalInstance.close(true); 
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('MoviePreviewModalController', function ($scope, $uibModalInstance, url) {
    var player;

    $scope.initPlayer = function () {
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

    $scope.dismiss = function () {
        $uibModalInstance.dismiss();
    };
});
