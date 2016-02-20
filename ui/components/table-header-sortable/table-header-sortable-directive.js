angular.module('jamm.tableHeaderSortable', [ ])
.directive('tableHeaderSortable', function() {

    return {
        restrict: "E",
        scope: {
            fieldName: '@',
            sortField: '=',
            sortReversed: '='
        },
        template: "<a href=\"#\" ng-click=\"sortField != fieldName ? sortField = fieldName : sortReversed = !sortReversed\"><span ng-transclude></span> <span class=\"glyphicon\" ng-if=\"sortField == fieldName\" ng-class=\"sortReversed ? 'glyphicon-chevron-down' : 'glyphicon-chevron-up'\"></span></a>",
        transclude: true
    };

});
