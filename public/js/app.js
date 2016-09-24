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
    '$rootScope',
    function($window, $http, $rootScope) {
        var userPromise;
        var initPromise = function() {
            userPromise = $http
            .get('/api/login/')
            .then(function(response) {
                $rootScope.$emit('login', response.data);
                return response.data;
            })
            .catch(function() {
                $rootScope.$emit('logout');
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
    'Session',
    function($rootScope, $scope, $mdDialog, $http, $location, Session) {
        $scope.showAccount = function(ev) {
            $mdDialog.show({
                controller: 'accountController',
                templateUrl: 'views/account.html',
                parent: angular.element(document.body),
                targetEvent: ev,
            });
        };

        // Try to login.
        Session.getUser();

        $rootScope.$on('login', function(event, user) {
            $scope.user = user;
        });

        $rootScope.$on('logout', function() {
            $scope.user = null;
        });

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
