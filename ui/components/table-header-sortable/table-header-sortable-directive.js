angular.module('jamm.tableHeaderSortable', [ ])
.directive('tableHeaderSortable', function() {

    return {
        restrict: "E",
        scope: {
            fieldName: '@',
            sortParam: '='
        },
        template: "<a href=\"#\" ng-click=\"sortParam.field != fieldName ? sortParam.field = fieldName : sortParam.reversed = !sortParam.reversed\"><span ng-transclude></span> <span class=\"glyphicon\" ng-if=\"sortParam.field == fieldName\" ng-class=\"sortParam.reversed ? 'glyphicon-chevron-down' : 'glyphicon-chevron-up'\"></span></a>",
        transclude: true
    };

});
