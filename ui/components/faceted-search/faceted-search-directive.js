angular.module('jamm.facetedSearch', [ ])
.directive('jammFacetedSearch', function() {

    function filterData(filter, items) {
        var filteredData = [];
        angular.forEach(items, function (item) {
            if (filter.year) {
                if (!item.releaseDate) {
                    return;
                }
                if (moment(item.releaseDate).year() != filter.year) {
                    return;
                }
            }

            if (filter.category) {
                if (!item.categories) {
                    return;
                }
                if (item.categories && _.filter(item.categories, { name: filter.category }).length == 0) {
                    return;
                }
            }

            if (filter.actor) {
                if (!item.actors) {
                    return;
                }
                if (item.actors && _.filter(item.actors, { name: filter.actor }).length == 0) {
                    return;
                }
            }

            if (filter.rating === 0 || filter.rating) {
                var filterRating = filter.rating + 0;
                var movieRating = item.rating ? item.rating : 0;
                if (filterRating != movieRating) {
                    return;
                }
            }

            filteredData.push(item);
        });
        return filteredData;
    }

    function loadStatistics(filter, items) {
        // faceted search statistics for year filter
        var years = {};
        var moviesIgnoreYearFilter = filterData(_.omit(filter, 'year'), items);
        angular.forEach(moviesIgnoreYearFilter, function (movie) {
            if (movie.releaseDate) {
                var year = moment(movie.releaseDate).year();
                years[year] = (years[year] | 0) + 1;
            }
        });

        // faceted search statistics for category filter
        var categories = {};
        var moviesIgnoreCategoryFilter = filterData(_.omit(filter, 'category'), items);
        angular.forEach(moviesIgnoreCategoryFilter, function (movie) {
            if (movie.categories) {
                angular.forEach(movie.categories, function (movieCategory) {
                    categories[movieCategory.name] = (categories[movieCategory.name] | 0) + 1;
                });
            }
        });

        // faceted search statistics for actor filter
        var actors = {};
        var moviesIgnoreActorFilter = filterData(_.omit(filter, 'actor'), items);
        angular.forEach(moviesIgnoreActorFilter, function (movie) {
            if (movie.actors) {
                angular.forEach(movie.actors, function (movieActor) {
                    actors[movieActor.name] = (actors[movieActor.name] | 0) + 1;
                });
            }
        });

        // faceted search statistics for rating filter
        var ratings = {};
        var moviesIgnoreRatingFilter = filterData(_.omit(filter, 'rating'), items);
        angular.forEach(moviesIgnoreRatingFilter, function (movie) {
            var rating = movie.rating ? movie.rating : 0;
            ratings[rating] = (ratings[rating] | 0) + 1;
        });

        var statistics = {
            years : _.map(years, function(value, key) {
                return { key: key, count: value };
            }),
            categories : _.map(categories, function(value, key) {
                return { key: key, count: value };
            }),
            actors : _.map(actors, function(value, key) {
                return { key: key, count: value };
            }),
            ratings : _.map(ratings, function(value, key) {
                return { key: parseInt(key, 10), count: value };
            })
        };

        return statistics;
    }

    function link(scope, element, attrs) {
        scope.filter = {};

        scope.resetFilter = function () {
            scope.filter = {};
        }

        scope.$watch('filter', function () {
            var filteredItems = filterData(scope.filter, scope.items);
            scope.statistics = loadStatistics(scope.filter, scope.items);
            scope.searchResultCallback({ items: filteredItems });
        }, true);

        scope.$watch('items', function () {
            var filteredItems = filterData(scope.filter, scope.items);
            scope.statistics = loadStatistics(scope.filter, scope.items);
            scope.searchResultCallback({ items: filteredItems });
        }, true);
    }

    return {
        restrict: "E",
        scope: {
            style: '=',
            items: '=',
            searchResultCallback: '&'
        },
        templateUrl: "components/faceted-search/faceted-search.html",
        link: link
    };

});

