angular.module('jamm')
.controller('MovieDetailController', function ($scope, MovieService, $stateParams, $state) {
    var movies = MovieService.movies;

    var movieId = $stateParams.id;
    if (movieId) {
        $scope.originalMovie = _.find(movies, { id: movieId });
        $scope.movie = _.cloneDeep($scope.originalMovie);
    }

    $scope.isModified = false;

    $scope.$watch('movie', function (value) {
        $scope.isModified = !_.isEqual(value, $scope.originalMovie);
    }, true);

    $scope.save = function() {
        _.assign($scope.originalMovie, $scope.movie);
        $scope.isModified = false;
    };

    $scope.discard = function() {
        $scope.movie = _.cloneDeep($scope.originalMovie);
    };

    $scope.delete = function () {
        _.remove(movies, { id: $scope.originalMovie.id });
        $('#confirmDeleteModal').on('hidden.bs.modal', function () {
            $state.go('movies');
        });
        $('#confirmDeleteModal').modal('hide');
    };

    $scope.slideshow = function(startWithImage) {
        var items = [];
        var startWithIndex = 0;

        if ($scope.movie.storage && $scope.movie.storage.cover) {
            items.push({
                src: $scope.movie.storage.cover,
                w: 0,
                h: 0
            });
        }

        if ($scope.movie.storage && $scope.movie.storage.images) {
            for (var image in $scope.movie.storage.images) {
                if ($scope.movie.storage.images[image].file == startWithImage) {
                    startWithIndex = items.length;
                }
                items.push({
                    src: $scope.movie.storage.images[image].file,
                    w: 0,
                    h: 0
                });
            }
        }

        var pswpElement = document.querySelectorAll('.pswp')[0];

        var options = {
            index: startWithIndex,
            history: false,
            showHideOpacity: true,
            loop: false,
            shareEl:false
        };

        var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

        // https://github.com/dimsemenov/PhotoSwipe/issues/796
        gallery.listen('gettingData', function(index, item) {
            if (item.w < 1 || item.h < 1) {
                var img = new Image(); 
                img.onload = function() {
                    item.w = this.width;
                    item.h = this.height;
                    gallery.updateSize(false);
                };
                img.src = item.src;
            };
        });

        gallery.init();
    };

});
