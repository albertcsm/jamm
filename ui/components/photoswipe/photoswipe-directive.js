angular.module('jamm.photoswipe', [ ])
.directive('jammPhotoswipeSlideshow', function() {
    return {
        restrict: 'E',
        templateUrl: 'components/photoswipe/photoswipe.html'
    }
})
.directive('jammPhotoswipeGallery', function () {

    var galleryElement;

    function PhotoswipeGalleryController() {
        this.items = [];
    }

    PhotoswipeGalleryController.prototype.addImage = function(item) {
        var index = this.items.length;
        this.items.push(item);
        return index;
    };

    PhotoswipeGalleryController.prototype.startSlideshow = function(startIndex) {
        var pswpElement = galleryElement.find('.pswp')[0];

        var options = {
            index: startIndex,
            history: false,
            showHideOpacity: true,
            loop: false,
            shareEl:false
        };

        var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, this.items, options);

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

    return {
        restrict: 'AE',
        scope: {},
        controller: [ PhotoswipeGalleryController ],
        compile: function (element) {
            element.append('<jamm-photoswipe-slideshow></jamm-photoswipe-slideshow>');
            galleryElement = element;
        }
    };
})
.directive('jammPhotoswipeImage', function($compile) {
    return {
        restrict: 'A',
        require: '^jammPhotoswipeGallery',
        scope: {},
        link: function (scope, element, attrs, controller) {
            var item = {
                src: attrs.jammPhotoswipeImage,
                w: 0,
                h: 0
            };

            var index = controller.addImage(item);

            element.click(function (){
                controller.startSlideshow(index);
            });
        }
    };

});
