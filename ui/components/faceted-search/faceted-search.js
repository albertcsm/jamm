angular.module('jamm.facetedSearch', [ ])
.factory('FacetedSearchIndex', function () {

    function buildInvertedIndex(invertedIndexMap, items, filterTemplates) {
        angular.forEach(items, function (item) {
            angular.forEach(filterTemplates, function (filterTemplate) {
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
        return invertedIndexMap;
    }

    function filterByText(items, searchText) {
        var filteredItems = [];
        var searchTextLowerCase = searchText.toLowerCase();
        for (var index in items) {
            var item = items[index];

            var match = false;
            angular.forEach(item, function (value, key) {
                if (matchByText(value, searchTextLowerCase)) {
                    match = true;
                }
            });
            if (match) {
                filteredItems.push(item);
            }
        }
        return filteredItems;
    }

    function matchByText(field, searchText) {
        if ((typeof field) == 'string') {
            return field.toLowerCase().indexOf(searchText) > -1;
        } else if (Array.isArray(field)) {
            for (var i = 0; i < field.length; i++) {
                if (matchByText(field[i], searchText)) {
                    return true;
                }
            }
            return false;
        } else if (field && (typeof field == 'object')) {
            return matchByText(field.name, searchText);
        } else {
            return false;
        }
    }

    var FacetedSearchIndex = function (items, filterTemplates) {
        this.items = items;
        this.filterTemplates = filterTemplates;
        this.invertedIndexMap = buildInvertedIndex({}, items, filterTemplates);
    };

    FacetedSearchIndex.prototype.getFilteredItems = function (filterSet, searchText) {
        var intersection = this.items;
        for (var appliedFilterName in filterSet) {
            var appliedFilterValues = filterSet[appliedFilterName];

            var union = [];
            for (var i = 0; i < appliedFilterValues.length; i++) {
                var appliedFilterValue = appliedFilterValues[i];
                union = _.union(union, this.invertedIndexMap[appliedFilterName][appliedFilterValue]);
            }

            if (intersection == this.items) {
                intersection = union;
            } else {
                intersection = _.intersection(intersection, union);
            }
        }

        if (searchText) {
            return filterByText(intersection, searchText);
        } else {
            return intersection;
        }
    };

    FacetedSearchIndex.prototype.getStatistics = function (filterSet, searchText) {
        var statistics = {};
        for (var i = 0; i < this.filterTemplates.length; i++) {
            var filterTemplate = this.filterTemplates[i];
            var filteredItems = this.getFilteredItems(_.omit(filterSet, filterTemplate.name), searchText);

            var histogram = {};
            var invertedIndex = this.invertedIndexMap[filterTemplate.name];
            for (var filterValue in invertedIndex) {
                var itemArray = invertedIndex[filterValue];
                if (itemArray) {
                    var count = _.intersection(itemArray, filteredItems).length;
                    if (count > 0 || (filterSet[filterTemplate.name] && filterSet[filterTemplate.name].indexOf(filterValue) != -1)) {
                        histogram[filterValue] = count;
                    }
                }
            }

            statistics[filterTemplate.name] = _.map(histogram, function(value, key) {
                return { key: key, count: value };
            });;
        }
        return statistics;
    };

    FacetedSearchIndex.prototype.addItem = function (item) {
        this.invertedIndexMap = buildInvertedIndex(this.invertedIndexMap, [ item ], this.filterTemplates);
    };

    FacetedSearchIndex.prototype.removeItem = function (item) {
        for (var filterName in this.invertedIndexMap) {
            var invertedIndex = this.invertedIndexMap[filterName];
            for (var filterValue in invertedIndex) {
                var pos = invertedIndex[filterValue].indexOf(item);
                if (pos != -1) {
                    invertedIndex[filterValue].splice(pos, 1);
                }
            }
        }
    };

    return FacetedSearchIndex;
});
