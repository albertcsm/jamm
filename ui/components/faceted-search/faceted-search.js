angular.module('jamm.facetedSearch', [ ])
.factory('FacetedSearchIndex', function () {

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
        this.filterTemplates = filterTemplates;
        this.invertedIndexMap = {};
        this.items = [];
        this.addItems(items);
    };

    FacetedSearchIndex.prototype.getInvalidatedFilterOptions = function (filterSet) {
        var filterOptions = {};
        for (var filterName in filterSet) {
            filterOptions[filterName] = [];
            var invertedIndex = this.invertedIndexMap[filterName];
            for (var i = 0; i < filterSet[filterName].length; i++) {
                var filterValue = filterSet[filterName][i];
                if (!invertedIndex[filterValue] || invertedIndex[filterValue].length == 0) {
                    filterOptions[filterName].push(filterValue);
                }
            }
        }
        return filterOptions;
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

    FacetedSearchIndex.prototype.addItems = function (items) {
        this.items = this.items.concat(items);
        var instance = this;
        angular.forEach(items, function (item) {
            angular.forEach(instance.filterTemplates, function (filterTemplate) {
                if (!instance.invertedIndexMap.hasOwnProperty(filterTemplate.name)) {
                    instance.invertedIndexMap[filterTemplate.name] = {};
                }
                var invertedIndexForField = instance.invertedIndexMap[filterTemplate.name];
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
    };

    FacetedSearchIndex.prototype.removeItems = function (predicate) {
        var items = _.filter(this.items, predicate);
        this.items = _.difference(this.items, items);
        for (var filterName in this.invertedIndexMap) {
            var invertedIndex = this.invertedIndexMap[filterName];
            for (var filterValue in invertedIndex) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var pos = invertedIndex[filterValue].indexOf(item);
                    if (pos != -1) {
                        invertedIndex[filterValue].splice(pos, 1);
                    }
                }
                if (invertedIndex[filterValue].length == 0) {
                    delete invertedIndex[filterValue];
                }
            }
        }
    };

    return FacetedSearchIndex;
});
