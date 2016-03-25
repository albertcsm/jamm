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
    FastClick.attach(document.body);

    $urlRouterProvider.otherwise("/movies");
    $stateProvider
        .state('movies', {
            url: "/movies",
            views: {
                '': {
                    templateUrl: 'list/movies.html',
                    controller: 'MovieRootController'
                },
                'list@movies': {
                    templateUrl: "list/movie-list.html",
                    controller: 'MovieListController'
                }
            }
        })
        .state('movies.detail', {
            url: "/:id",
            views: {
                'detail@movies': {
                    templateUrl: "detail/movie-detail.html",
                    controller: 'MovieDetailController'
                }
            }
        })
        .state('import', {
            url: "/import",
            templateUrl: "import/movie-import.html",
            controller: 'MovieImportController'
        })
        .state('about', {
            url: "/about",
            templateUrl: "about.html"
        });
});
