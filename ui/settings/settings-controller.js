angular.module('jamm')
.controller('SettingsController', function ($scope, Repo) {
    $scope.repos = Repo.query(function () {
        $scope.repos.push({
            id: 'Movies',
            fields: [
                {
                    name: 'Cover',
                    type: 'Image'
                },
                {
                    name: 'Name',
                    type: 'Text'
                },
                {
                    name: 'Subheading',
                    type: 'Text'
                },
                {
                    name: 'Actors',
                    type: 'List of text'
                },
                {
                    name: 'Release date',
                    type: 'Date'
                },
                {
                    name: 'Categories',
                    type: 'Tags'
                },
                {
                    name: 'Rating',
                    type: 'Rating'
                }
            ]
        });
    });
});
