angular.module('jamm.facetedSearch', [ ])
.directive('jammFacetedSearch', function() {

    function link(scope, element, attrs) {
        scope.statistics = {};
        scope.filterSet = {};
        var invertedIndexMap = {};

        function getFilteredItems(filterSet) {
            var intersection = scope.items;
            for (var appliedFilterName in filterSet) {
                var appliedFilterValues = filterSet[appliedFilterName];

                angular.forEach(appliedFilterValues, function (appliedFilterValue) {
                    if (intersection == scope.items) {
                        intersection = invertedIndexMap[appliedFilterName][appliedFilterValue];
                    } else {
                        intersection = _.intersection(intersection, invertedIndexMap[appliedFilterName][appliedFilterValue]);
                    }
                });
            }
            return intersection;
        }

        function updateStatistics(filteredItems) {
            scope.statistics = {};
            for (var i = 0; i < scope.filterTemplates.length; i++) {
                var filterTemplate = scope.filterTemplates[i];

                var histogram = {};
                var invertedIndex = invertedIndexMap[filterTemplate.name];
                for (var filterValue in invertedIndex) {
                    var itemArray = invertedIndex[filterValue];
                    if (itemArray) {
                        var count = _.intersection(itemArray, filteredItems).length;
                        if (count > 0) {
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
            var filteredItems = getFilteredItems(scope.filterSet);
            updateStatistics(filteredItems);
            scope.searchResultCallback({ items: filteredItems });
        }

        scope.resetFilters = function () {
            scope.filterSet = {};
            applyFilters();
        }

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
            idField: '@',
            filterTemplates: '=',
            searchResultCallback: '&'
        },
        templateUrl: "components/faceted-search/faceted-search.html",
        link: link
    };

});

