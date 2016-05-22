angular.module('jamm')
.factory('Repo', function ($resource) {
    return $resource('/api/repos/:id', { id: '@_id' }, {
        update: { method: 'PUT' },
        create: { method: 'POST', params: { id: null } }
    });
});