angular.module('jamm.facetedSearch', [ ])
.directive('jammFacetedSearch', function() {

    function filterData(mappedValueSets, filterSet) {
        var filteredData = [];
        for (var id in mappedValueSets) {
            var mappedValueSet = mappedValueSets[id];

            var discard = false;
            for (var filterName in filterSet) {
                var filterValue = filterSet[filterName];
                if (filterValue) {
                    var mappedValue = mappedValueSet[filterName];
                    if (Array.isArray(mappedValue)) {
                        var found = false;
                        if (mappedValue.indexOf(filterValue) == -1) {
                            discard = true;
                            break;
                        }
                    } else {
                        if (mappedValue != filterValue) {
                            discard = true;
                            break;
                        }
                    }
                }
            }

            if (!discard) {
                filteredData.push(mappedValueSet);
            }
        }
        return filteredData;
    }

    function loadStatistics(mappedValueSets, filterSet, filterTemplates) {
        var statistics = {};

        for (var i = 0; i < filterTemplates.length; i++) {
            var filterTemplate = filterTemplates[i];

            var filteredData = filterData(mappedValueSets, _.omit(filterSet, filterTemplate.name));
            var histogram = {};
            for (var id in filteredData) {
                var mappedValueSet = filteredData[id];
                var mappedValue = mappedValueSet[filterTemplate.name];
                if (Array.isArray(mappedValue)) {
                    for (var j = 0; j < mappedValue.length; j++) {
                        histogram[mappedValue[j]] = (histogram[mappedValue[j]] | 0) + 1;
                    }
                } else {
                    histogram[mappedValue] = (histogram[mappedValue] | 0) + 1;
                }
            }
            statistics[filterTemplate.name] = _.map(histogram, function(value, key) {
                return { key: key, count: value };
            });;
        }
        return statistics;
    }

    function link(scope, element, attrs) {
        scope.statistics = {};
        scope.filterSet = {};
        var mappedValueSets = {};
        var itemIndex = {};

        function applyFilters() {
            var filteredData = filterData(mappedValueSets, scope.filterSet);
            scope.statistics = loadStatistics(mappedValueSets, scope.filterSet, scope.filterTemplates);
            var filteredItems = [];
            for (var i = 0; i < filteredData.length; i++) {
                var filteredId = filteredData[i]._id;
                filteredItems.push(itemIndex[filteredId]);
            }
            scope.searchResultCallback({ items: filteredItems });
        }

        scope.resetFilters = function () {
            scope.filterSet = {};
        }

        scope.$watch('filterSet', function () {
            applyFilters();
        }, true);

        scope.$watch('items', function () {
            mappedValueSets = {};
            itemIndex = {};
            angular.forEach(scope.items, function (item) {
                var id = item[scope.idField];
                var mappedValueSet = {};
                angular.forEach(scope.filterTemplates, function (filterTemplate) {
                    mappedValueSet[filterTemplate.name] = filterTemplate.valueMapper(item);
                });
                mappedValueSet._id = id;
                mappedValueSets[id] = mappedValueSet;
                itemIndex[id] = item;
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

