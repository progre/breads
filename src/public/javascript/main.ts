/// <reference path="../../DefinitelyTyped/angular-1.0.d.ts"/>

declare var twttr: any;

var app = angular.module('app', ['ngRoute', 'ngAnimate']);
app.config(['$locationProvider', '$routeProvider',
    ($locationProvider: ng.ILocationProvider, $routeProvider: ng.IRouteProvider) => {
        var depth = 2;
        var base = location.pathname.match('^((\/.+?){' + depth + '})\/')[1];
        $locationProvider.html5Mode(true);
        $routeProvider
            .when(base + '/', {
                templateUrl: 'html/index.html'
            }).when(base + '/memory.html', {
                templateUrl: 'html/memory.html', controller: 'MemoryController'
            }).when(base + '/nomemory.html', {
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
                angular.element('#twitter')
                    .html(getTweetButton(
                        '私は一日に' + $scope.breadsPerDay + '枚のパンを食べます'))
                    .ready(() => twttr.widgets.load());
                return;
            }
            if (breadsPerDay === 0.0) {
                $scope.breadsPerDay = 0;
                $scope.daysPerBread = null;
                angular.element('#twitter')
                    .html(getTweetButton('私はパンを食べません'))
                    .ready(() => twttr.widgets.load());
                return;
            }
            $scope.breadsPerDay = null;
            $scope.daysPerBread = (1 / breadsPerDay) | 0;
            angular.element('#twitter')
                .html(getTweetButton(
                    '私は' + $scope.daysPerBread + '日に一枚パンを食べます'))
                .ready(() => twttr.widgets.load());
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
            if ($scope.breadsPerLife === 0) {
                angular.element('#twitter')
                    .html(getTweetButton('私はパンを食べません'))
                    .ready(() => twttr.widgets.load());
                return;
            }
            angular.element('#twitter')
                .html(getTweetButton(
                    '私は今日までに' + $scope.breadsPerLife + '枚のパンを食べました'))
                .ready(() => twttr.widgets.load());
        }
        $scope.$watch('age', () => onParameterChanged());
        $scope.$watch('breadsPerDay', () => onParameterChanged());
    }]);

function getTweetButton(message: string) {
    return '<a href="https://twitter.com/share" data-lang="ja" data-url="http://www.prgrssv.net/izayoi/breads/" data-text="' + message + '" data-size="large" data-count="none" class="twitter-share-button">結果をツイート</a>';
}

angular.bootstrap(<any>document, ['app']);
