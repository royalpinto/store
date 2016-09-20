/* global angular */

angular

.module('app')

.controller('browseController', [
    '$scope',
    '$http',
    '$mdSidenav',
    function($scope, $http, $mdSidenav) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };

        $scope.skip = 0;
        $scope.limit = 30;

        var getParams = function() {
            return {
                skip: $scope.skip,
                limit: $scope.limit,
            };
        };

        $scope.load = function() {
            $http
            .get('/api/products/', {
                params: getParams(),
            })
            .then(function(response) {
                $scope.products = response.data;
            })
            ;
        };

        $scope.last = function() {
            var limit = $scope.limit;
            $scope.skip = parseInt($scope.products.count / limit, 10) * limit;
        };

        $scope.$watch('skip', $scope.load);
        $scope.load();

        $http.get('/api/products/categories/', {
        })
        .then(function(response) {
            $scope.categories = response.data;
        })
        ;

        $http.get('/api/products/brands/', {
        })
        .then(function(response) {
            $scope.brands = response.data;
        })
        ;
    },
])

;
