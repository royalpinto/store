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


.service('Session', [
    function() {
        this.create = function(data) {
            this._id = data._id;
            this.username = data.username;
            this.name = data.name;
            this.email = data.email;
        };
        this.destroy = function() {
            this.id = null;
            this.username = null;
            this.name = null;
            this.roleIds = null;
        };
    },
])


.controller('appController', [
    '$rootScope',
    '$scope',
    '$mdDialog',
    '$http',
    function($rootScope, $scope, $mdDialog, $http) {
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
                $rootScope.$emit('search', $scope.search.text);
            },
        };
    },
])

;
