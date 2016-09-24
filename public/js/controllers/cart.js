/* global angular */

angular

.module('app')

.controller('cartController', [
    '$scope',
    '$http',
    function($scope, $http) {
        $http.get('/api/cart/items/')
        .then(function(response) {
            $scope.items = response.data;
        })
        ;

        var quantitiesMap = {};
        $scope.loadQuanities = function(quantity) {
            var quantities = quantitiesMap[quantity];
            if (!quantities) {
                quantities = [];
                for (var i = 1; i <= quantity; i++) {
                    quantities.push(i);
                }
                quantitiesMap[quantity] = quantities;
            }
            return quantities;
        };

        $scope.getTotal = function() {
            var total = 0;
            var items = $scope.items;
            for (var i = 0; i < (items || []).length; i++) {
                var item = items[i];
                total += (item.product.price * item.quantity);
            }
            return total;
        };

        $scope.updateQuantity = function(item, newquantity) {
            $http.put('/api/cart/items/', {
                productId: item.productId,
                quantity: newquantity,
            })
            .then(function() {
                item.quantity = newquantity;
            })
            ;
        };

        $scope.removeFromCart = function(item) {
            $http.delete('/api/cart/items/', {
                params: {
                    productId: item.productId,
                },
            })
            .then(function() {
                $scope.items.splice($scope.items.indexOf(item), 1);
            })
            ;
        };
    },
])

;
