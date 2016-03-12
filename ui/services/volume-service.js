angular.module('jamm')
.factory('Volume', function ($resource) {
    return $resource('/api/volumes/:id/:subResource', { id: '@_id' }, {
        update: { method: 'PUT' },
        create: { method: 'POST', params: { id: null } },
        files: { method: 'GET', isArray: true, params: { subResource: 'files' } }
    });
});
