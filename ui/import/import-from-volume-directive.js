angular.module('jamm')
.directive('importFromVolume', function($parse, $uibModal, VolumeFile, MediaInfoService) {

    function link(scope, element, attrs) {
        scope.volume = $parse(attrs.volume)(scope);

        scope.volume.files = VolumeFile.query({ volumeId: scope.volume._id }, function () {
            for (var key in scope.volume.files) {
                if (scope.volume.files[key].type == 'directory') {
                    scope.volume.files[key].children = [ {} ];
                }
            }
        });

        scope.selectedPath = null;
        scope.mediaInfo = null;

        scope.showSelected = function (node, selected) {
            if (scope.mediaInfo) {
                scope.mediaInfo.cancel();
            }
            if (selected) {
                scope.selectedPath = node.path;
                if (node.type == 'directory') {
                    scope.mediaInfo = MediaInfoService.getMediaInfo(scope.volumes[0]._id, node.path);
                } else {
                    scope.mediaInfo = null;
                }   
            } else {
                scope.mediaInfo = null;
            }
        };

        scope.showToggle = function(volumeId, node, expanded, $parentNode, $index, $first, $middle, $last, $odd, $even) {
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

        scope.previewVideo = function(url) {
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

        scope.import = function() {
            $uibModal.open({
                size: 'lg',
                templateUrl: 'movie-info-modal-template',
                controller: 'MovieImportModalController',
                resolve: {
                    volumeId: function() { return scope.volumes[0]._id; },
                    path: function() { return scope.selectedPath; },
                    images: function() { return scope.mediaInfo.images; }
                }
            }).result.then(function () {
                
            });
        };

        scope.$on('$destroy', function () {
            if (scope.mediaInfo) {
                scope.mediaInfo.cancel();
            }
        });
    }

    return {
        restrict: "E",
        templateUrl: 'import/import-from-volume.html',
        scope: true,
        link: link
    };
});