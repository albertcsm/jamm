angular.module('jamm')
.controller('MovieImportController', function ($scope, $uibModal, Movie, Volume, VolumeFile) {
    function parseMediaInfoDuration(val) {
        var parts = val.split(' ');
        var seconds = 0;
        for (var key in parts) {
            if (parts[key].match(/[0-9]+h$/)) {
                seconds += parseInt(parts[key], 10) * 3600;
            } else if (parts[key].match(/[0-9]+mn$/)) {
                seconds += parseInt(parts[key], 10) * 60;
            } else if (parts[key].match(/[0-9]+s$/)) {
                seconds += parseInt(parts[key], 10);
            } else {
                console.error('unknown duration format: ' + val);
            }
        }
        return seconds;
    }

    function parseMediaInfoResolution(mediaInfo) {
        for (var key in mediaInfo.tracks) {
            var track = mediaInfo.tracks[key];
            if (track.type == 'Video') {
                var width = parseInt(track.width.replace(' ', ''), 10);
                var height = parseInt(track.height.replace(' ', ''), 10);
                return width + 'x' + height;
            }
        }
    }

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

    $scope.selectedDir = null;

    $scope.showSelected = function (node, selected) {
        if (selected && node.type == 'directory') {
            var dir = { path: node.path, images: [], videos: [] };
            VolumeFile.query({ volumeId: $scope.volumes[0]._id, dir: node.path }, function (files) {
                angular.forEach(files, function (file) {
                    if (file.type == 'file') {
                        if (file.name.match(/\.jpg$/)) {
                            dir.images.push({
                                file: 'api/volumes/' + $scope.volumes[0]._id + '/files/' + encodeURIComponent(node.path + '/' + file.name)
                            })
                        } else if (file.name.match(/\.mp4$/) || file.name.match(/\.mkv$/) || file.name.match(/\.wmv$/) || file.name.match(/\.avi$/) || file.name.match(/\.rmvb$/)) {
                            var videoInfo = { path: file.path, file: file.name, resolution: null, length: null, size: file.size };
                            dir.videos.push(videoInfo);
                            var mediaInfo = VolumeFile.mediaInfo({ volumeId: $scope.volumes[0]._id, path: file.path }, function () {
                                videoInfo.length = parseMediaInfoDuration(mediaInfo.duration);
                                videoInfo.resolution = parseMediaInfoResolution(mediaInfo);
                            });
                        }
                    }
                });
                $scope.selectedDir = dir;
            });
        } else {
            $scope.selectedDir = null;
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

    $scope.previewVideo = function(volume, video) {
        var url = 'api/volumes/' + volume._id + '/files/' + encodeURIComponent(video.path);
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
                path: function() { return $scope.selectedDir.path; }
            }
        }).result.then(function () {
            
        });
    };
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

    $scope.init = function () {
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
