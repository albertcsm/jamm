angular.module('jamm.pager', [ ])
.directive('jammPager', function() {

    return {
        restrict: "E",
        scope: {
            pageCount: '=',
            currentPage: '=',
            setPage: '&'
        },
        templateUrl: "components/pager/pager.html"
    };

});

