angular.module('jamm')
.service('MediaInfoService', function ($q, VolumeFile) {
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

    this.getMediaInfo = function (volumeId, path, callback) {
        var videos = [];
        var images = [];
        var others = [];

        var deferred = $q.defer();
        var promise = deferred.promise;

        var dependentPromises = [];

        dependentPromises.push(VolumeFile.query({ volumeId: volumeId, dir: path }, function (files) {
            function handleFile(file) {
                var info = {
                    name: file.name,
                    size: file.size,
                    src: 'api/volumes/' + volumeId + '/files/' + encodeURIComponent(file.path)
                };
                if (file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
                    images.push(info);
                } else if (file.name.match(/\.(mp4|mkv|wmv|avi|rmvb|mpg)$/)) {
                    videos.push(info);
                    var videoInfo = VolumeFile.mediaInfo({ volumeId: volumeId, path: file.path }, function () {
                        if (videoInfo.duration) {
                            info.length = parseMediaInfoDuration(videoInfo.duration);
                        }
                        info.resolution = parseMediaInfoResolution(videoInfo);
                    });
                    dependentPromises.push(videoInfo);
                } else {
                    others.push(info);
                }
            };

            function handleDir(dir) {
                dependentPromises.push(VolumeFile.query({ volumeId: volumeId, dir: dir.path }, function (files) {
                    angular.forEach(files, function (file) {
                        if (file.type == 'file') {
                            handleFile(file);
                        }
                    });
                }));
            }

            angular.forEach(files, function (file) {
                if (file.type == 'file') {
                    handleFile(file);
                } else {
                    handleDir(file);
                }
            });

            $q.all(dependentPromises).then(function () {
                deferred.resolve(promise);
            });
            deferred.notify(promise);
            if (callback) {
                callback(promise);
            }
        }));

        promise.videos = videos;
        promise.images = images;
        promise.others = others;
        promise.cancel = function () {
            for (var key in dependentPromises) {
                dependentPromises[key].$cancelRequest();
            }
        };
        return promise;
    };
});