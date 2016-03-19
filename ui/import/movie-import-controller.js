angular.module('jamm')
.controller('MovieImportController', function ($scope, Volume) {

    $scope.volumes = Volume.query();

})
.controller('MovieImportModalController', function ($scope, $uibModalInstance, Movie, volumeId, path, images) {
    $scope.movie = {
        storage: {
            volume: volumeId,
            path: path
        }
    };

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

    $scope.save = function (model) {
        Movie.create(model, function () {
            $uibModalInstance.close(true);
            $scope.movie = model;
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
