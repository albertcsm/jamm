angular.module('jamm')
.controller('MovieListController', function ($scope, MovieService, $stateParams) {
    $scope.movies = MovieService.movies;
});
