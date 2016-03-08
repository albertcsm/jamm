angular.module('jamm')
.factory('Movie', function ($resource) {

    return $resource('/api/movies/:id', { id: '@_id' }, {
        update: { method: 'PUT' },
        create: { method: 'POST', params: { id: null } }
    });

});