/// <reference path="../../DefinitelyTyped/angular-1.0.d.ts"/>

declare var twttr: any;

var app = angular.module('app', ['ngRoute', 'ngAnimate']);
app.config(['$routeProvider',
    ($routeProvider: ng.IRouteProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: 'html/index.html'
            }).when('/memory.html', {
                templateUrl: 'html/memory.html', controller: 'MemoryController'
            }).when('/nomemory.html', {
                templateUrl: 'html/nomemory.html', controller: 'NoMemoryController'
            }).otherwise({
                templateUrl: 'html/404.html'
            });
    }
]);
app.controller('MemoryController',
    ['$scope', ($scope: any) => {
        function onParameterChanged() {
            var ageNum = parseInt($scope.age);
            var breadsPerLifeNum = parseInt($scope.breadsPerLife);
            if (isNaN(ageNum) || isNaN(breadsPerLifeNum)) {
                $scope.show = false;
                return;
            }
            $scope.show = true;
            var breadsPerDay = breadsPerLifeNum / (ageNum * 365);
            if (breadsPerDay >= 1) {
                $scope.breadsPerDay = breadsPerDay | 0;
                $scope.daysPerBread = null;
                twttr.widgets.load();
                return;
            }
            if (breadsPerDay === 0.0) {
                $scope.breadsPerDay = 0;
                $scope.daysPerBread = null;
                twttr.widgets.load();
                return;
            }
            $scope.breadsPerDay = null;
            $scope.daysPerBread = (1 / breadsPerDay) | 0;
            twttr.widgets.load();
        }
        $scope.$watch('age', () => onParameterChanged());
        $scope.$watch('breadsPerLife', () => onParameterChanged());
    }]);

app.controller('NoMemoryController',
    ['$scope', ($scope: any) => {
        function onParameterChanged() {
            var ageNum = parseInt($scope.age);
            var breadsPerDayNum = parseInt($scope.breadsPerDay);
            if (isNaN(ageNum) || isNaN(breadsPerDayNum)) {
                $scope.breadsPerLife = null;
                return;
            }
            $scope.breadsPerLife = ageNum * 365 * breadsPerDayNum;
            twttr.widgets.load();
        }
        $scope.$watch('age', () => onParameterChanged());
        $scope.$watch('breadsPerDay', () => onParameterChanged());
    }]);

angular.bootstrap(<any>document, ['app']);
