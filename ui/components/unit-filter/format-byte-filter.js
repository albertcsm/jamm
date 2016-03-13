// https://notetops.wordpress.com/2014/11/28/angularjs-filter-to-format-file-size/
angular.module('jamm.unitFilter', [])
.filter('formatByte', function () {
    return function (size, useBinary) {
        var base, prefixes;
     
        if (useBinary) {
            base = 1024;
            prefixes = ['Ki','Mi','Gi','Ti','Pi','Ei','Zi','Yi'];
        } else {
            base = 1000;
            prefixes = ['k','M','G','T','P','E','Z','Y'];
        }
     
        var exp = Math.log(size) / Math.log(base) | 0;
        return (size / Math.pow(base, exp)).toFixed(1) + ' ' + ((exp > 0) ? prefixes[exp - 1] + 'B' : 'Bytes');
    };
})
.filter('formatDuration', function () {
    return function (duration) {
        if (!duration) {
            return null;
        }

        var hours = Math.floor(duration / 3600);
        var minutes = Math.floor((duration - hours * 3600) / 60);
        var seconds = Math.round(duration - hours * 3600 - minutes * 60);
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        if (hours == 0) {
            return minutes + ':' + seconds;
        } else {
            return hours + ':' + minutes + ':' + seconds;
        }
    };
});