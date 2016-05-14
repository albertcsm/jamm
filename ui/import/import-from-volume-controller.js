angular.module('jamm')
.service('MovieModelInitializer', function () {
    this.initializeMovieModel = function (volumeId, path, mediaInfo) {
        var initModel = {
            name: path.split('/').reverse()[0],
            actors: [ { name: '' } ],
            storage: {
                volume: volumeId,
                path: path
            }
        };
        for (var key in mediaInfo.images) {
            var imageInfo = mediaInfo.images[key];
            if (imageInfo.name.match(/^(.*\W)?cover(\W.*)?$/)) {
                initModel.storage.cover = imageInfo.name;
                break;
            }
        }
        return initModel;
    };
})
.controller('ImportFromVolumeController', function($scope, $stateParams, $parse, $uibModal, Volume, VolumeFile, MediaInfoService, MovieService, MovieModelInitializer) {

    $scope.volumeId = $stateParams.id;

    $scope.volume = Volume.get({ id: $scope.volumeId });

    $scope.loadVolumeFiles = function () {
        $scope.volumeFiles = VolumeFile.query({ volumeId: $scope.volumeId }, function () {
            for (var key in $scope.volumeFiles) {
                if ($scope.volumeFiles[key].type == 'directory') {
                    $scope.volumeFiles[key].children = [ {} ];
                }
            }
            
            $scope.selectedPath = null;
            $scope.mediaInfo = null;
        });
    };

    $scope.loadVolumeFiles();

    function loadImportedMovies() {
        $scope.importedPaths = [];
        return MovieService.query(function (movies) {
            $scope.importedPaths = [];
            angular.forEach(movies, function (movie) {
                if (movie.storage.volume == $scope.volumeId) {
                    $scope.importedPaths.push(movie.storage.path);
                }
            });
        });
    }

    loadImportedMovies().$promise.then(function () {
        MovieService.subscribe($scope, function (data) {
            if (data.event == 'deleted') {
                console.log('received movie deleted event: ' + data.id);
                loadImportedMovies();
            }
        });
    });

    $scope.showSelected = function (node, selected) {
        if ($scope.mediaInfo) {
            $scope.mediaInfo.cancel();
        }
        if (selected) {
            $scope.selectedPath = node.path;
            if (node.type == 'directory') {
                $scope.mediaInfo = MediaInfoService.getMediaInfo($scope.volumeId, node.path);
            } else {
                $scope.mediaInfo = null;
            }   
        } else {
            $scope.mediaInfo = null;
        }
    };

    $scope.showToggle = function(node, expanded, $parentNode, $index, $first, $middle, $last, $odd, $even) {
        if (expanded) {
            node.children = VolumeFile.query({ volumeId: $scope.volumeId, dir: node.path }, function () {
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
                movie: function() {
                    return MovieModelInitializer.initializeMovieModel($scope.volumeId, $scope.selectedPath, $scope.mediaInfo);
                },
                images: function() { return $scope.mediaInfo.images; }
            }
        }).result.then(function (saved) {
            if (saved) {
                $scope.importedPaths.push($scope.selectedPath);
            }
        });
    };

    $scope.showEditVolumeModal = function() {
        $uibModal.open({
            size: 'lg',
            templateUrl: 'edit-volume-template',
            controller: 'EditVolumeModalController',
            resolve: {
                volume: function () {
                    return $scope.volume;
                }
            }
        }).result.then(function () {
            $scope.volume = Volume.get({ id: $scope.volumeId });
            $scope.$emit('import.volumeUpdated', $scope.volumeId);
        });
    };

    $scope.$on('$destroy', function () {
        if ($scope.mediaInfo) {
            $scope.mediaInfo.cancel();
        }
    });
});
