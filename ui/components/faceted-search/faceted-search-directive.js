angular.module('jamm.facetedSearch')
.directive('jammFacetedSearch', function() {

    function link(scope, element, attrs) {
        scope.statistics = {};

        scope.resetFilters = function () {
            angular.forEach(scope.filterSet, function (value, key) {
                delete scope.filterSet[key];
            });
        }

        scope.toggleFilterOption = function(filterName, filterValue) {
            if (scope.filterSet[filterName]) {
                var foundAtIndex = scope.filterSet[filterName].indexOf(filterValue);

                if (foundAtIndex == -1) {
                    scope.filterSet[filterName].push(filterValue);
                } else {
                    scope.filterSet[filterName].splice(foundAtIndex, 1);
                    if (!scope.filterSet[filterName].length) {
                        delete scope.filterSet[filterName];
                    }
                }
            } else {
                scope.filterSet[filterName] = [ filterValue ];
            }
        }

        scope.isFilterOptionSelected = function(filterName, filterValue) {
            if (!scope.filterSet[filterName] || scope.filterSet[filterName].indexOf(filterValue) == -1) {
                return false;
            } else {
                return true;
            }
        }
     }

    return {
        restrict: "E",
        scope: {
            style: '=',
            filterSet: '=filters',
            filterTemplates: '=',
            statistics: '='
        },
        templateUrl: "components/faceted-search/faceted-search.html",
        link: link
    };

});

