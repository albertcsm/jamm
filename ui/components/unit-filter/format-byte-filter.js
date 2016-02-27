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
});