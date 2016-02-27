angular.module('jamm', [ 
    'ui.bootstrap',
    'ui.router',
    'ui.sortable',
    'ngAnimate',
    'jamm.unitFilter',
    'jamm.tableHeaderSortable',
    'jamm.dateTimePicker',
    'jamm.photoswipe',
    'jamm.repository',
    'jamm.coverThumbnail',
    'jamm.navBar'
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
            templateUrl: "import/movie-import.html"
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
