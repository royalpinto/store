/* global angular, document */

angular

.module('app', [
    'ngRoute',
    'ngMaterial',
])

.config([
    '$routeProvider',
    '$locationProvider',
    '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
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
        .when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'profileController',
        })
        ;

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(['$q',
            '$rootScope',
            function($q, $rootScope) {
                return {
                    responseError: function(rejection) {
                        if (rejection.status === 401 &&
                            !rejection.config.ignorelogin) {
                            $rootScope.$emit('unauthicatedaccess');
                        }
                        return $q.reject(rejection);
                    },
                };
            },
        ]);

        $httpProvider.interceptors.push([
            '$q',
            '$rootScope',
            function($q, $rootScope) {
                return {
                    request: function(request) {
                        $rootScope.$emit('apiloading');
                        return request;
                    },
                    response: function(response) {
                        $rootScope.$emit('apiloaded');
                        return response;
                    },
                    responseError: function(rejection) {
                        $rootScope.$emit('apiloaded');
                        return $q.reject(rejection);
                    },
                };
            },
        ]);
    },
])


.directive("compareTo", function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo",
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue === scope.otherModelValue;
            };
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        },
    };
})


.config([
    '$mdThemingProvider',
    function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        ;
        $mdThemingProvider.theme('success-toast');
        $mdThemingProvider.theme('error-toast');
    },
])


.service('Toast', [
    '$mdToast',
    function($mdToast) {
        this.success = function(message) {
            var toast = $mdToast
                .simple()
                .content(message)
                .position('top right')
                .theme('success-toast')
                ;
            $mdToast.show(toast);
        };

        this.error = function(message) {
            var toast = $mdToast
                .simple()
                .content(message)
                .position('top right')
                .theme('error-toast')
                ;
            $mdToast.show(toast);
        };
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
            .get('/api/login/', {
                ignorelogin: true,
            })
            .then(function(response) {
                $rootScope.$emit('login', response.data);
                return response.data;
            })
            .catch(function(response) {
                $rootScope.$emit('logout');
                throw response;
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
        $rootScope.$on('apiloading', function() {
            $scope.loading = true;
        });

        $rootScope.$on('apiloaded', function() {
            $scope.loading = false;
        });

        $scope.showAccount = function(ev) {
            Session.getUser()
            .then(function() {
                $location.path('/profile/');
            })
            .catch(function(response) {
                if (response.status === 401) {
                    $mdDialog.show({
                        controller: 'accountController',
                        templateUrl: 'views/account.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                    });
                }
            })
            ;
        };

        // Try to login.
        Session.getUser();

        $rootScope.$on('login', function(event, user) {
            $scope.user = user;
        });

        $rootScope.$on('logout', function() {
            $scope.user = null;
        });

        $rootScope.$on('unauthicatedaccess', function() {
            $scope.showAccount();
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
