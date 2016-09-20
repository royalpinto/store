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
    '$http',
    function($scope, $mdDialog, $http) {
        $scope.showAccount = function(ev) {
            $mdDialog.show({
                controller: 'accountController',
                templateUrl: 'views/account.html',
                parent: angular.element(document.body),
                targetEvent: ev,
            });
        };

        $scope.search = function(query) {
            return $http
            .get('/api/products/?', {
                params: {
                    search: query,
                },
            })
            .then(function(response) {
                return response.data.data;
            })
            ;
        };

        $scope.searchSubmit = function() {
            console.log('searchSubmit', $scope.searchText);
        };
    },
])

;
