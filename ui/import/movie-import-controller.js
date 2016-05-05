angular.module('jamm')
.controller('MovieImportController', function ($scope, $uibModal, Volume) {
    function initVolumes() {
        $scope.volumePieCharts = {};

        $scope.volumes = Volume.query(function () {
            angular.forEach($scope.volumes, function(volume, key) {
                var diskusage = Volume.diskusage({ id: volume._id }, function () {
                    var percentage = Math.round((1 - diskusage.free / diskusage.total) * 1000) / 10;
                    $scope.volumePieCharts[volume._id] = [{
                        label: volume.name,
                        value: percentage,
                        suffix: "%",
                        color: "steelblue"
                    }];
                });
            });
        });
    };

    initVolumes();

    $scope.pieChartOptions = {
        mode: "gauge",
        thickness: 3,
        total: 100
    };

    $scope.showAddVolumeModal = function(volume) {
        $uibModal.open({
            size: 'lg',
            templateUrl: 'edit-volume-template',
            controller: 'EditVolumeModalController',
            resolve: {
                volume: function () {
                    return volume;
                }
            }
        }).result.then(function () {
            initVolumes();
        });
    };
})
.controller('MovieImportModalController', function ($scope, $uibModalInstance, MovieService, images, movie) {
    $scope.movie = movie;

    $scope.mediaInfo = {
        images: images
    }

    $scope.getCoverUrl = function (movie) {
        if (movie && movie.storage) {
            var storage = movie.storage;
            return 'api/volumes/' + storage.volume + '/files/' + encodeURIComponent(storage.path + '/' + storage.cover);
        } else {
            return null;
        }
    };

    $scope.save = function () {
        MovieService.create($scope.movie, function () {
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
        player = videojs('videoPlayer', { responsive: true, aspectRatio: '16:9' }).ready(function() {
            this.hotkeys({
                enableVolumeScroll: false,
                enableNumbers: false
            });
            this.src(url);
        });
    };

    $scope.$on('$destroy', function () {
        player.dispose();
    });

    $scope.dismiss = function () {
        $uibModalInstance.dismiss();
    };
})
.controller('EditVolumeModalController', function ($scope, $uibModalInstance, Volume, volume) {
    $scope.isNew = !volume || !volume._id;
    $scope.volume = angular.copy(volume);
    var originalVolume = angular.copy(volume);
    $scope.isModified = false;

    $scope.$watch('volume', function () {
        $scope.isModified = !angular.equals($scope.volume, originalVolume);
    }, true);

    $scope.save = function() {
        if ($scope.isNew) {
            Volume.create({ name: $scope.volume.name, path: $scope.volume.path }, function () {
                $uibModalInstance.close(true);
            });
        } else {
            $scope.volume.$update(function () {
                $uibModalInstance.close(true); 
            });
        }
    };

    $scope.delete = function () {
        Volume.delete({ id: originalVolume._id }, function () {
            $uibModalInstance.close(false); 
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});