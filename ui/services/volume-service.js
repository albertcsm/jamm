angular.module('jamm')
.factory('Volume', function ($resource) {
    return $resource('/api/volumes/:id/:subResource', { id: '@_id' }, {
        update: { method: 'PUT' },
        create: { method: 'POST', params: { id: null } }
    });
})
.factory('VolumeFile', function ($resource) {
    return $resource('/api/volumes/:volumeId/files/:path/:subResource', { path: '@path' }, {
        mediaInfo: { method: 'GET', params: { subResource: 'mediaInfo' } }
    }, { cancellable: true });
});
