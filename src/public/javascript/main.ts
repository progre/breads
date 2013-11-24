/// <reference path="../../DefinitelyTyped/angular-1.0.d.ts"/>

var app = angular.module('app', ['ngRoute', 'ngAnimate']);
app.config(['$routeProvider',
    ($routeProvider: ng.IRouteProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: 'html/index.html', controller: 'IndexController'
            }).otherwise({
                templateUrl: 'html/404.html'
            });
    }
]);
app.controller('IndexController',
    [() => {
    }]);

angular.bootstrap(<any>document, ['app']);
