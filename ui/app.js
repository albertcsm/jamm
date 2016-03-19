angular.module('jamm', [ 
    'ui.bootstrap',
    'ui.router',
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
    'jamm.navBar',
    'jamm.movieDetailForm'
]).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/movies");
    $stateProvider
        .state('movies', {
            url: "/movies",
            templateUrl: "list/movie-list.html",
            controller: 'MovieListController'
        })
        .state('movies/detail', {
            url: "/movies/:id",
            templateUrl: "detail/movie-detail.html",
            controller: 'MovieDetailController'
        })
        .state('import', {
            url: "/import",
            templateUrl: "import/movie-import.html",
            controller: 'MovieImportController'
        })
        .state('settings', {
            url: "/settings",
            templateUrl: "settings/settings.html"
        })
        .state('about', {
            url: "/about",
            templateUrl: "about.html"
        });
});
