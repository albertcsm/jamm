angular.module('jamm')
.service('MediaInfoService', function (VolumeFile) {
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
        var mediaInfo = {
            videos: [],
            images: [],
            others: []
        };

        VolumeFile.query({ volumeId: volumeId, dir: path }, function (files) {
            angular.forEach(files, function (file) {
                if (file.type == 'file') {
                    var info = {
                        name: file.name,
                        size: file.size,
                        src: 'api/volumes/' + volumeId + '/files/' + encodeURIComponent(file.path)
                    };
                    if (file.name.match(/\.jpg$/) || file.name.match(/\.png$/)) {
                        mediaInfo.images.push(info);
                    } else if (file.name.match(/\.mp4$/) || file.name.match(/\.mkv$/) || file.name.match(/\.wmv$/) || file.name.match(/\.avi$/) || file.name.match(/\.rmvb$/)) {
                        mediaInfo.videos.push(info);
                        var videoInfo = VolumeFile.mediaInfo({ volumeId: volumeId, path: file.path }, function () {
                            info.length = parseMediaInfoDuration(videoInfo.duration);
                            info.resolution = parseMediaInfoResolution(videoInfo);
                        });
                    } else {
                        mediaInfo.others.push(info);
                    }
                }
            });

            if (callback) {
                callback(mediaInfo);
            }
        });

        return mediaInfo;
    };
});