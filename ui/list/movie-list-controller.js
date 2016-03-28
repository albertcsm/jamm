angular.module('jamm')
.controller('MovieListController', function ($scope, Movie) {
    function loadData() {
        Movie.query(function (movies) {
            $scope.movies = movies;

            var years = {};
            var categories = {};
            var ratings = { };
            angular.forEach(movies, function (movie) {
                if (movie.releaseDate) {
                    var year = moment(movie.releaseDate).year();
                    if (years.hasOwnProperty(year)) {
                        years[year]++;
                    } else {
                        years[year] = 1;
                    }
                }
                if (movie.categories) {
                    angular.forEach(movie.categories, function (movieCategory) {
                        if (categories.hasOwnProperty(movieCategory.name)) {
                            categories[movieCategory.name]++;
                        } else {
                            categories[movieCategory.name] = 1;
                        }
                    });
                }
                var rating = movie.rating ? movie.rating : 0;
                if (ratings.hasOwnProperty(rating)) {
                    ratings[rating]++;
                } else {
                    ratings[rating] = 1;
                }
            });
            $scope.years = _.map(years, function(value, key) {
                return { key: key, count: value };
            });
            $scope.categories = _.map(categories, function(value, key) {
                return { key: key, count: value };
            });
            $scope.ratings = ratings;
        });
    }

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
        if (toState.name == 'movies.list') {
            loadData();
        }
    });

    loadData();

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
