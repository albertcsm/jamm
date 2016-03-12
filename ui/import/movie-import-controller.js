angular.module('jamm')
.controller('MovieImportController', function ($scope, $uibModal, Movie, Volume) {
    $scope.volumes = Volume.query(function () {
        var volumeId = $scope.volumes[0]._id;
        $scope.volumes[0].files = Volume.files({ id: volumeId }, function () {
            for (var key in $scope.volumes[0].files) {
                if ($scope.volumes[0].files[key].type == 'directory') {
                    $scope.volumes[0].files[key].children = [ {} ];
                }
            }
        });
    });

    $scope.selectedDir = null;

    $scope.showSelected = function (node) {
        if (node.type == 'directory') {
            var dir = { images: [], videos: [] };
            var path = node.dir ? node.dir + '/' + node.name : node.name;
            Volume.files({ id: $scope.volumes[0]._id, dir: path }, function (files) {
                angular.forEach(files, function (file) {
                    if (file.type == 'file') {
                        if (file.name.match(/\.jpg$/)) {
                            dir.images.push({
                                file: 'api/volumes/' + $scope.volumes[0]._id + '/files/' + encodeURIComponent(path + '/' + file.name)
                            })
                        } else if (file.name.match(/\.mp4$/) || file.name.match(/\.mkv$/)) {
                            dir.videos.push({ file: file.name, resolution: '1280x688', length: '2:06:35', size: 1626060492 });
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
            var dirPath = node.dir ? node.dir + '/' + node.name : node.name;
            node.children = Volume.files({ id: volumeId, dir: dirPath }, function () {
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

    $scope.import = function() {
        $uibModal.open({
            size: 'lg',
            templateUrl: 'movie-info-modal-template',
            controller: 'MovieImportModalController'
        }).result.then(function () {
            
        });
    };
})
.controller('MovieImportModalController', function ($scope, $uibModalInstance) {
    $scope.save = function () {
        $uibModalInstance.close(true);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

