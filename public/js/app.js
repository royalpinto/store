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
        .when('/product/:_id/', {
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


.service('Session', [
    '$window',
    '$http',
    function($window, $http) {
        var userPromise;
        var initPromise = function() {
            userPromise = $http
            .get('/api/login/')
            .then(function(response) {
                return response.data;
            })
            ;
        };

        // Keep login promise ready for Session methods.
        initPromise();

        this.getUser = function() {
            return userPromise;
        };

        this.create = function() {
            initPromise();
        };

        this.destroy = function() {
            initPromise();
        };
    },
])


.controller('appController', [
    '$rootScope',
    '$scope',
    '$mdDialog',
    '$http',
    '$location',
    function($rootScope, $scope, $mdDialog, $http, $location) {
        $scope.showAccount = function(ev) {
            $mdDialog.show({
                controller: 'accountController',
                templateUrl: 'views/account.html',
                parent: angular.element(document.body),
                targetEvent: ev,
            });
        };

        $scope.search = {
            text: null,
            change: function(query) {
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
            },
            submit: function() {
                var path = $location.path();
                if (path === '/') {
                    $rootScope.$emit('search', $scope.search.text);
                } else {
                    $location.path('/');
                }
            },
        };
    },
])

;
