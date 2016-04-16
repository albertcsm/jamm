angular.module('jamm.facetedSearch', [ ])
.directive('jammFacetedSearch', function() {

    function link(scope, element, attrs) {
        scope.statistics = {};
        var invertedIndexMap = {};

        function buildInvertedIndex() {
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
        }

        function getFilteredItems(filterSet) {
            var intersection = scope.items;
            for (var appliedFilterName in filterSet) {
                var appliedFilterValues = filterSet[appliedFilterName];

                var union = [];
                angular.forEach(appliedFilterValues, function (appliedFilterValue) {
                    union = _.union(union, invertedIndexMap[appliedFilterName][appliedFilterValue]);
                });

                if (intersection == scope.items) {
                    intersection = union;
                } else {
                    intersection = _.intersection(intersection, union);
                }
            }
            return intersection;
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
                        if (count > 0 || (scope.filterSet[filterTemplate.name] && scope.filterSet[filterTemplate.name].indexOf(filterValue) != -1)) {
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
            angular.forEach(scope.filterSet, function (value, key) {
                delete scope.filterSet[key];
            });
            applyFilters();
        }

        scope.$watch('items', function () {
            buildInvertedIndex();
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

