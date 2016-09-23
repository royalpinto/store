/* global angular */

angular

.module('app')

.controller('productController', [
    '$scope',
    '$routeParams',
    '$http',
    function($scope, $routeParams, $http) {
        $http.get('/api/products/' + $routeParams._id + '/')
        .then(function(response) {
            $scope.product = response.data;
            $scope.quantities = (function(quantity) {
                var quantities = [];
                for (var i = 1; i <= quantity; i++) {
                    quantities.push(i);
                }
                return quantities;
            })($scope.product.quantity);
        })
        ;
    },
])

;
