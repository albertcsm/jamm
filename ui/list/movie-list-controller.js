angular.module('jamm')
.controller('MovieListController', function ($scope, MovieService, $stateParams) {
    $scope.movies = MovieService.movies;
    $scope.displayStyle = 'list';
    $scope.sortParam = {
        field: 'releaseDate',
        reversed: true
    };
    $scope.searchString = '';
});
