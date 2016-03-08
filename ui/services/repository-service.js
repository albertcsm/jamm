angular.module('jamm')
.factory('Repository', function ($resource) {

    return $resource('/api/repositories/:id', { id: '@_id' }, {
        update: { method: 'PUT' },
        create: { method: 'POST', params: { id: null } }
    });

});