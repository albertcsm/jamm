angular.module('jamm.facetedSearch')
.directive('jammFacetedSearch', function(FacetedSearchIndex) {

    function link(scope, element, attrs) {
        scope.statistics = {};
        var facetedSearchIndex;

        function applyFilters() {
            scope.statistics = facetedSearchIndex.getStatistics(scope.filterSet);

            var filteredItems = facetedSearchIndex.getFilteredItems(scope.filterSet);
            scope.searchResultCallback({ items: filteredItems });
        }

        scope.resetFilters = function () {
            angular.forEach(scope.filterSet, function (value, key) {
                delete scope.filterSet[key];
            });
            applyFilters();
        }

        scope.$watch('items', function () {
            facetedSearchIndex = new FacetedSearchIndex(scope.items, scope.filterTemplates);
            applyFilters();
        }, true);

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
            applyFilters();
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
            items: '=',
            filterSet: '=filters',
            filterTemplates: '=',
            searchResultCallback: '&'
        },
        templateUrl: "components/faceted-search/faceted-search.html",
        link: link
    };

});

