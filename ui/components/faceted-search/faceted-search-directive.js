angular.module('jamm.facetedSearch', [ ])
.directive('jammFacetedSearch', function() {

    function link(scope, element, attrs) {
        scope.statistics = {};
        scope.filterSet = {};
        var invertedIndexMap = {};

        function getFilteredItems(filterSet) {
            if (filterSet && !angular.equals(filterSet, {})) {
                var filteredItems = [];
                angular.forEach(scope.items, function (item) {
                    var survive = true;
                    for (var filterName in filterSet) {
                        var filterValue = filterSet[filterName];
                        if (filterValue) {
                            var itemArray = invertedIndexMap[filterName][filterValue];
                            if (!itemArray || itemArray.indexOf(item) == -1) {
                                survive = false;
                                break;
                            }
                        }
                    }
                    if (survive) {
                        filteredItems.push(item);
                    }
                });
                return filteredItems;
            } else {
                return scope.items;
            }
        }

        function updateStatistics() {
            scope.statistics = {};
            for (var i = 0; i < scope.filterTemplates.length; i++) {
                var filterTemplate = scope.filterTemplates[i];

                var filteredItems = getFilteredItems(_.omit(scope.filterSet, filterTemplate.name));

                var histogram = {};
                var invertedIndex = invertedIndexMap[filterTemplate.name];
                for (var filterValue in invertedIndex) {
                    var itemArray = invertedIndex[filterValue];
                    if (itemArray) {
                        var count = _.intersection(itemArray, filteredItems).length;
                        if (count) {
                            histogram[filterValue] = count;
                        }
                    }
                }
                scope.statistics[filterTemplate.name] = _.map(histogram, function(value, key) {
                    return { key: key, count: value };
                });;
            }
        }

        function applyFilters() {
            updateStatistics();
            var filteredItems = getFilteredItems(scope.filterSet);
            scope.searchResultCallback({ items: filteredItems });
        }

        scope.resetFilters = function () {
            scope.filterSet = {};
        }

        scope.$watch('filterSet', function () {
            applyFilters();
        }, true);

        scope.$watch('items', function () {
            invertedIndexMap = {};
            angular.forEach(scope.items, function (item) {
                var id = item[scope.idField];

                angular.forEach(scope.filterTemplates, function (filterTemplate) {
                    if (!invertedIndexMap.hasOwnProperty(filterTemplate.name)) {
                        invertedIndexMap[filterTemplate.name] = {};
                    }
                    var invertedIndexForField = invertedIndexMap[filterTemplate.name];
                    var mappedValue = filterTemplate.valueMapper(item);
                    if (mappedValue) {
                        function addToIndex(value) {
                            if (!invertedIndexForField[value]) {
                                invertedIndexForField[value] = [];
                            }
                            invertedIndexForField[value].push(item);
                        }

                        if (Array.isArray(mappedValue)) {
                            angular.forEach(mappedValue, addToIndex);
                        } else {
                            addToIndex(mappedValue);
                        }
                    }
                });
            });
            applyFilters();
        }, true);
    }

    return {
        restrict: "E",
        scope: {
            style: '=',
            items: '=',
            idField: '@',
            filterTemplates: '=',
            searchResultCallback: '&'
        },
        templateUrl: "components/faceted-search/faceted-search.html",
        link: link
    };

});

