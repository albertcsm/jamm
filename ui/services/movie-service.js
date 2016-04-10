angular.module('jamm')
.factory('MovieService', function ($resource, $rootScope) {

    var Movie = $resource('/api/movies/:id', { id: '@_id' }, {
        update: { method: 'PUT' },
        create: { method: 'POST', params: { id: null } }
    });

    return {
        query: function () {
            return Movie.query.apply(null, arguments);
        },
        get: function () {
            return Movie.get.apply(null, arguments);
        },
        create: function (value, callback) {
            var ret = Movie.create(value, callback);
            ret.$promise.then(function () {
                $rootScope.$emit('MovieService:event', { event: 'added', value: value });
            });
            return ret;
        },
        update: function (id, newValue, callback) {
            var promise = newValue.$update(callback);
            promise.then(function () {
                $rootScope.$emit('MovieService:event', { event: 'updated', id: id, newValue: newValue });
            });
            return promise;
        },
        delete: function (param, callback) {
            var ret = Movie.delete(param, callback);
            ret.$promise.then(function () {
                $rootScope.$emit('MovieService:event', { event: 'deleted', id: param.id });
            });
            return ret;
        },
        subscribe: function (scope, callback) {
            var off = $rootScope.$on('MovieService:event', function (event, data) {
                callback(data);
            });
            scope.$on('$destroy', off);
            return off;
        }
    };

});