/* global angular, document */

angular

.module('app')

.controller('productController', [
    '$scope',
    '$routeParams',
    '$http',
    '$mdDialog',
    function($scope, $routeParams, $http, $mdDialog) {
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

        $scope.editCartItem = {
            show: function() {
                $mdDialog.show({
                    parent: angular.element(document.body),
                    contentElement: '#editCartItemDialog',
                });
            },
            close: function() {
                $mdDialog.hide();
            },
            update: function(quantity) {
                $mdDialog.hide();
                $http.put('/api/cart/items/', {
                    productId: $routeParams._id,
                    quantity: quantity,
                })
                ;
            },
        };

        $scope.addToCart = function(quantity) {
            $http.post('/api/cart/items/', {
                productId: $routeParams._id,
                quantity: quantity,
            })
            .catch(function(response) {
                var data = response.data;
                if (data.error === 'productId already added.') {
                    $scope.editCartItem.show();
                } else {
                    console.error(data);
                }
            })
            ;
        };
    },
])

;
