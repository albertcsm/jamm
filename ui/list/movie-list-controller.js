angular.module('jamm')
.controller('MovieListController', function ($scope, $q, MovieService, Volume, FacetedSearchIndex) {
    var facetedSearchIndex;
    var volumeIdToNameMap;

    $scope.movies = [];
    $scope.filteredMovies = [];
    $scope.showFilter = false;
    $scope.filters = {};
    $scope.searchText = '';
    $scope.statistics = {};
    $scope.pageSize = 24;
    $scope.pageCount = 0;
    $scope.currentPage = 0;
    $scope.filterTemplates = [
        {
            name: 'Year',
            valueMapper: function (movie) {
                return moment(movie.releaseDate).year();
            }
        },
        {
            name: 'Category',
            valueMapper: function (movie) {
                return _.map(movie.categories, 'name');
            }
        },
        {
            name: 'Actor',
            valueMapper: function (movie) {
                return _.map(movie.actors, 'name');
            }
        },
        {
            name: 'Rating',
            valueMapper: function (movie) {
                if (movie.rating > 1) {
                    return movie.rating + ' stars';
                } else if (movie.rating == 1) {
                    return '1 star';
                } else if (!movie.rating) {
                    return 'no star';
                }
            }
        },
        {
            name: 'Volume',
            valueMapper: function (movie) {
                return volumeIdToNameMap[movie.storage.volume];
            }
        }
    ];

    function loadVolumes() {
        return Volume.query(function (volumes) {
            volumeIdToNameMap = {};
            for (var i = 0; i < volumes.length; i++) {
                var volume = volumes[i];
                volumeIdToNameMap[volume._id] = volume.name;
            }
        }).$promise;
    }

    function loadMovies() {
        return MovieService.query(function (movies) {
            $scope.movies = movies;
        }).$promise;
    }

    function initializeFacetedSearchFilter() {
        facetedSearchIndex = new FacetedSearchIndex($scope.movies, $scope.filterTemplates);
        updateFilteredMovies();
        updatePageCount();

        $scope.$watch('filters', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                updateFilteredMovies();
                updatePageCount();
            }
        }, true);

        $scope.$watch('searchText', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                updateFilteredMovies();
                updatePageCount();
            }
        });

        MovieService.subscribe($scope, function (data) {
            if (data.event == 'deleted') {
                console.log('received movie deleted event: ' + data.id);
                
                var index = _.findIndex($scope.movies, { _id : data.id });
                facetedSearchIndex.removeItem($scope.movies[index]);
                $scope.movies.splice(index, 1);

                updateFilteredMovies();
                updatePageCount();
            } else if (data.event == 'updated') {
                console.log('received movie updated event: ' + data.id);

                var index = _.findIndex($scope.movies, { _id : data.id });
                facetedSearchIndex.removeItem($scope.movies[index]);
                facetedSearchIndex.addItem(data.newValue);
                $scope.movies.splice(index, 1, data.newValue);

                updateFilteredMovies();
                updatePageCount();
            } else if (data.event == 'added') {
                console.log('received movie added event: ' + data.value);

                facetedSearchIndex.addItem(data.value);
                $scope.movies.push(data.value);

                updateFilteredMovies();
                updatePageCount();
            }
        });
    }

    function updateFilteredMovies() {
        $scope.filteredMovies = facetedSearchIndex.getFilteredItems($scope.filters, $scope.searchText);
        $scope.statistics = facetedSearchIndex.getStatistics($scope.filters, $scope.searchText);
    }

    function updatePageCount() {
        $scope.pageCount = Math.ceil($scope.filteredMovies.length / $scope.pageSize);
        if ($scope.pageCount > 0) {
            if ($scope.currentPage >= $scope.pageCount) {
                $scope.currentPage = $scope.pageCount - 1;
            }
        }
    }

    $q.all([ loadMovies(), loadVolumes() ]).then(initializeFacetedSearchFilter);

    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.pageCount) {
            $scope.currentPage = page;
        }
    };

    $scope.displayStyle = 'thumbnail';
    $scope.sortParam = {
        field: 'releaseDate',
        reversed: true
    };
    $scope.sortDescription = null;

    $scope.$watch('sortParam', function (value) {
        if (value.field == 'releaseDate' && value.reversed == true) {
            $scope.sortDescription = 'Latest';
        } else if (value.field == 'releaseDate' && value.reversed == false) {
            $scope.sortDescription = 'Earliest';
        } else if (value.field == 'name') {
            $scope.sortDescription = 'Sort by name';
        } else if (value.field == 'rating' && value.reversed == true) {
            $scope.sortDescription = 'Highest rated';
        } else if (value.field == 'rating' && value.reversed == false) {
            $scope.sortDescription = 'Lowest rated';
        } else {
            $scope.sortDescription = 'Sorting';
        }
    }, true);

    $scope.isFilterDefined = function (filters) {
        return !angular.equals(filters, {});
    }

    $scope.getCoverUrl = function (movie) {
        var storage = movie.storage;
        if (storage && storage.cover) {
            return 'api/volumes/' + storage.volume + '/files/' + encodeURIComponent(storage.path + '/' + storage.cover);
        } else {
            return null;
        }
    };
});
