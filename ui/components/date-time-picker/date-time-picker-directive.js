angular.module('jamm.dateTimePicker', [ ])
.directive('dateTimePicker', function() {

    return {
        restrict: "E",
        scope: {
            modelValue: '=ngModel',
            format: '@'
        },
        template: "<div class='input-group date'><input type='text' class='form-control' ng-model='modelValue'/><span class='input-group-addon'><span class='glyphicon glyphicon-calendar'></span></span></div>",
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!scope.format) {
                scope.format = 'YYYY-MM-DD';
            }
            angular.element(element.children()[0]).datetimepicker({format: scope.format}).on('dp.change', function (event) {
                scope.$apply(function() {
                    scope.modelValue = moment(event.date).format(scope.format);
                });
            });
        }
    };

});
