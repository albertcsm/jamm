angular.module('jamm')
.controller('MovieListController', function ($scope, MovieService, $stateParams) {
    $scope.movies = MovieService.movies;
    $scope.displayStyle = 'list';
    $scope.sortField = 'releaseDate';
    $scope.sortReversed = true;
    $scope.searchString = '';
});
