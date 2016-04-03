angular.module('jamm')
.controller('MovieListController', function ($scope, Movie) {
    function loadMovies() {
        Movie.query(function (movies) {
            $scope.movies = movies;
            $scope.filteredMovies = filterMovies($scope.filter, $scope.movies);
            loadStatistics();
            loadPages();
        });
    }

    function filterMovies(filter, movies) {
        if (!filter) {
            return movies;
        } else {
            var filteredMovies = [];
            angular.forEach(movies, function (movie) {
                if (filter.year) {
                    if (!movie.releaseDate) {
                        return;
                    }
                    if (moment(movie.releaseDate).year() != filter.year) {
                        return;
                    }
                }

                if (filter.category) {
                    if (!movie.categories) {
                        return;
                    }
                    if (movie.categories && _.filter(movie.categories, { name: filter.category }).length == 0) {
                        return;
                    }
                }

                if (filter.rating === 0 || filter.rating) {
                    var filterRating = filter.rating + 0;
                    var movieRating = movie.rating ? movie.rating : 0;
                    if (filterRating != movieRating) {
                        return;
                    }
                }

                filteredMovies.push(movie);
            });
            return filteredMovies;
        }
    }

    function loadStatistics() {
        var years = {};
        var categories = {};
        var ratings = {};
        angular.forEach($scope.movies, function (movie) {
            if (movie.releaseDate) {
                var year = moment(movie.releaseDate).year();
                if (!years.hasOwnProperty(year)) {
                    years[year] = 0;
                } 
            }
            if (movie.categories) {
                angular.forEach(movie.categories, function (movieCategory) {
                    if (!categories.hasOwnProperty(movieCategory.name)) {
                        categories[movieCategory.name] = 0;
                    }
                });
            }
            var rating = movie.rating ? movie.rating : 0;
            if (!ratings.hasOwnProperty(rating)) {
                ratings[rating] = 0;
            }
        });

        // faceted search statistics for year filter
        var moviesIgnoreYearFilter = filterMovies(_.omit($scope.filter, 'year'), $scope.movies);
        angular.forEach(moviesIgnoreYearFilter, function (movie) {
            if (movie.releaseDate) {
                var year = moment(movie.releaseDate).year();
                years[year]++;
            }
        });
        $scope.years = _.map(years, function(value, key) {
            return { key: key, count: value };
        });

        // faceted search statistics for category filter
        var moviesIgnoreCategoryFilter = filterMovies(_.omit($scope.filter, 'category'), $scope.movies);
        angular.forEach(moviesIgnoreCategoryFilter, function (movie) {
            if (movie.categories) {
                angular.forEach(movie.categories, function (movieCategory) {
                    categories[movieCategory.name]++;
                });
            }
        });
        $scope.categories = _.map(categories, function(value, key) {
            return { key: key, count: value };
        });

        // faceted search statistics for rating filter
        var moviesIgnoreRatingFilter = filterMovies(_.omit($scope.filter, 'rating'), $scope.movies);
        angular.forEach(moviesIgnoreRatingFilter, function (movie) {
            var rating = movie.rating ? movie.rating : 0;
            ratings[rating]++;
        });
        $scope.ratings = ratings;
    }

    $scope.pageSize = 24;
    $scope.pageCount = 0;
    $scope.currentPage = 0;

    function loadPages() {
        $scope.pageCount = $scope.filteredMovies ? Math.ceil($scope.filteredMovies.length / $scope.pageSize) : 0;
        var startPage = Math.max(Math.min($scope.currentPage - 2, $scope.pageCount - 5), 0);
        var stopPage = Math.min(startPage + 5, $scope.pageCount);
        $scope.pages = _.range(startPage, stopPage);
    }

    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.pageCount) {
            $scope.currentPage = page;
            loadPages();
        }
    };

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
        if (toState.name == 'movies.list') {
            loadMovies();
        }
    });

    $scope.$watch('filter', function () {
        $scope.filteredMovies = filterMovies($scope.filter, $scope.movies);
        loadStatistics();
        loadPages();
        $scope.currentPage = 0;
    }, true);

    loadMovies();

    $scope.resetFilter = function () {
        $scope.filter = {};
    }

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

    $scope.filter = {};

    $scope.getCoverUrl = function (movie) {
        var storage = movie.storage;
        if (storage && storage.cover) {
            return 'api/volumes/' + storage.volume + '/files/' + encodeURIComponent(storage.path + '/' + storage.cover);
        } else {
            return null;
        }
    };
});
