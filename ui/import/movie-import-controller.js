angular.module('jamm')
.controller('MovieImportController', function ($scope, Movie, Repository) {
    $scope.repositories = Repository.query();
});
