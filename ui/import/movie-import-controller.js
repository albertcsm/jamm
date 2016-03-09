angular.module('jamm')
.controller('MovieImportController', function ($scope, $uibModal, Movie, Repository) {
    $scope.repositories = Repository.query(function () {
        var repoId = $scope.repositories[0]._id;
        $scope.repositories[0].files = Repository.files({ id: repoId }, function () {
            for (var key in $scope.repositories[0].files) {
                if ($scope.repositories[0].files[key].type == 'directory') {
                    $scope.repositories[0].files[key].children = [ {} ];
                }
            }
        });
    });

    $scope.showSelected = function (node) {
        console.log(node);
    };

    $scope.showToggle = function(repoId, node, expanded, $parentNode, $index, $first, $middle, $last, $odd, $even) {
        if (expanded) {
            var dirPath = node.dir ? node.dir + '/' + node.name : node.name;
            node.children = Repository.files({ id: repoId, dir: dirPath }, function () {
                for (var key in node.children) {
                    if (node.children[key].type == 'directory') {
                        node.children[key].children = [ {} ];
                    }
                }
            });
        } else {
            node.children = [ {} ];
        }
    };

    $scope.movie = { 
        "_id": "HUNGER_GAME-3_1",
        "name": "The Hunger Games: Mockingjay – Part 1",
        "actors": [ 
            { "name": "Jennifer Lawrence" },
            { "name": "Josh Hutcherson" },
            { "name": "Liam Hemsworth" }
        ],
        "releaseDate": "2014-11-10",
        "rating": 2,
        "tags": [ "Adventure", "Sci-Fi" ],
        "storage": {
            "repository": "home",
            "path": "Downloads/bt/The Hunger Games Mockingjay Part 1 (2014) HDRip XviD-MAXSPEED",
            "cover": "media/cover.jpg",
            "images": [
                { "file": "media/gallery1.jpg" },
                { "file": "media/gallery2.jpg" }
            ],
            "videos": [
                { 
                    "file": "media/video1.mp4",
                    "resolution": "720x480",
                    "length": "05:10",
                    "size": 33387486
                },
                {
                    "file": "media/video2.mkv",
                    "resolution": "1280x688",
                    "length": "2:06:35",
                    "size": 1626060492
                }
            ],
            "quality": "HD"
        }
    };

    $scope.import = function() {
        $uibModal.open({
            size: 'lg',
            templateUrl: 'movie-info-modal-template',
            controller: 'MovieImportModalController'
        }).result.then(function () {
            
        });
    };
})
.controller('MovieImportModalController', function ($scope, $uibModalInstance) {
    $scope.save = function () {
        $uibModalInstance.close(true);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

