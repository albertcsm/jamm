angular.module('jamm.repository', [])
.factory('Movie', function ($resource) {

    return $resource('/api/movies/:id', { id: '@id' }, {
        update: { method: 'PUT' },
        create: { method: 'POST', params: { id: null } }
    });

});