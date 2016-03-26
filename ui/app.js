angular.module('jamm', [ 
    'ui.bootstrap',
    'ui.router',
    'ct.ui.router.extras',
    'as.sortable',
    'ngResource',
    'ngAnimate',
    'treeControl',
    'n3-pie-chart',
    'jamm.unitFilter',
    'jamm.tableHeaderSortable',
    'jamm.dateTimePicker',
    'jamm.photoswipe',
    'jamm.coverThumbnail',
    'jamm.movieDetailForm'
]).config(function ($stateProvider, $urlRouterProvider) {
    FastClick.attach(document.body);

    $urlRouterProvider.otherwise("/movies");
    $stateProvider
        .state('movies', {
            url: '/movies',
            abstract: true,
            sticky: true
        })
        .state('movies.list', {
            url: '',
            sticky: true,
            views: {
                'movieList@': {
                    templateUrl: "list/movie-list.html",
                    controller: 'MovieListController'
                }
            }
        })
        .state('movies.detail', {
            url: "/:id",
            views: {
                'movieDetail@': {
                    templateUrl: "detail/movie-detail.html",
                    controller: 'MovieDetailController'
                }
            }
        })
        .state('import', {
            url: "/import",
            sticky: true,
            views: {
                'import': {
                    templateUrl: "import/movie-import.html",
                    controller: 'MovieImportController'
                }
            }
        })
        .state('about', {
            url: "/about",
            templateUrl: "about.html"
        });
})
.controller('AppStateController', function ($scope, $state) {
    $scope.routerState = $state;
});
