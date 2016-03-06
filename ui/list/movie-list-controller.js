angular.module('jamm')
.controller('MovieListController', function ($scope, Movie, $stateParams) {
    $scope.movies = Movie.query();
    $scope.displayStyle = 'list';
    $scope.sortParam = {
        field: 'releaseDate',
        reversed: true
    };
    $scope.searchString = '';
});
