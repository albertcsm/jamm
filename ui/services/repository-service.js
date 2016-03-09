angular.module('jamm')
.factory('Repository', function ($resource) {
    return $resource('/api/repositories/:id/:subResource', { id: '@_id' }, {
        update: { method: 'PUT' },
        create: { method: 'POST', params: { id: null } },
        files: { method: 'GET', isArray: true, params: { subResource: 'files' } }
    });
});
