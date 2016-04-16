angular.module('jamm')
.controller('MovieListController', function ($scope, MovieService) {
    function loadMovies() {
        MovieService.query(function (movies) {
            $scope.movies = movies;
            $scope.filteredMovies = movies;
            updatePageCount();

            MovieService.subscribe($scope, function (data) {
                if (data.event == 'deleted') {
                    console.log('received movie deleted event: ' + data.id);
                    _.remove($scope.movies, { _id : data.id });
                    updatePageCount();
                } else if (data.event == 'updated') {
                    console.log('received movie updated event: ' + data.id);
                    var index = _.findIndex($scope.movies, { _id : data.id });
                    $scope.movies.splice(index, 1, data.newValue);
                } else if (data.event == 'added') {
                    console.log('received movie added event: ' + data.value);
                    $scope.movies.push(data.value);
                }
            });
        });
    }

    $scope.showFilter = false;
    $scope.filters = {};
    $scope.pageSize = 24;
    $scope.pageCount = 0;
    $scope.currentPage = 0;

    function updatePageCount() {
        $scope.pageCount = $scope.filteredMovies ? Math.ceil($scope.filteredMovies.length / $scope.pageSize) : 0;
        if ($scope.currentPage >= $scope.pageCount) {
            $scope.currentPage = $scope.pageCount - 1;
        }
    }

    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.pageCount) {
            $scope.currentPage = page;
        }
    };

    // $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
    //     if (toState.name == 'movies.list') {
    //         loadMovies();
    //     }
    // });

    loadMovies();

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

    $scope.searchString = '';

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
        }
    ];

    $scope.updateFilteredMovies = function (items) {
        $scope.filteredMovies = items;
        updatePageCount();
        $scope.setPage(0);
    }

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
