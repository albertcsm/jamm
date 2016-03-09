angular.module('jamm')
.controller('MovieImportController', function ($scope, Movie, Repository) {
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
});
