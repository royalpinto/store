/* global angular, document */

angular

.module('app', [
    'ngRoute',
    'ngMaterial',
])

.config([
    '$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'views/browse.html',
            controller: 'browseController',
        })
        .when('/product', {
            templateUrl: 'views/product.html',
            controller: 'productController',
        })
        .when('/cart', {
            templateUrl: 'views/cart.html',
            controller: 'cartController',
        })
        ;

        $locationProvider.html5Mode(true);
    },
])

.controller('appController', [
    '$scope',
    '$mdDialog',
    function($scope, $mdDialog) {
        $scope.showAccount = function(ev) {
            $mdDialog.show({
                controller: 'accountController',
                templateUrl: 'views/account.html',
                parent: angular.element(document.body),
                targetEvent: ev,
            });
        };
    },
])

.controller('browseController', [
    '$scope',
    function($scope) {
        $scope.filters = [{
            name: 'Allen Solly',
        }, {
            name: 'Allen Solly',
        }, {
            name: 'Allen Solly',
        }];
        console.log(123);
        $scope.products = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    },
])

;
