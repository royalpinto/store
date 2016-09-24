/* global angular, document */

angular

.module('app')

.controller('productController', [
    '$scope',
    '$routeParams',
    '$http',
    '$mdDialog',
    'Toast',
    function($scope, $routeParams, $http, $mdDialog, Toast) {
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
                .then(function() {
                    Toast.success("Updated quantity!");
                })
                .catch(function() {
                    Toast.error("Failed to update quantity!");
                })
                ;
            },
        };

        $scope.addToCart = function(quantity) {
            $http.post('/api/cart/items/', {
                productId: $routeParams._id,
                quantity: quantity,
            })
            .then(function() {
                Toast.success("Product added to the cart!");
            })
            .catch(function(response) {
                var data = response.data;
                if (data.error === 'productId already added.') {
                    $scope.editCartItem.show();
                } else {
                    Toast.error("Failed to add to the cart!");
                }
            })
            ;
        };
    },
])

;
