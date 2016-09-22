/* global angular */

angular

.module('app')

.controller('browseController', [
    '$rootScope',
    '$scope',
    '$http',
    '$mdSidenav',
    function($rootScope, $scope, $http, $mdSidenav) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
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
                console.log('submit');
                $scope.load();
            },
        };
        $rootScope.$on('search', function(event, text) {
            $scope.search.text = text;
            $scope.load();
        });

        $scope.skip = 0;
        $scope.limit = 30;

        var filterController = function(name) {
            var filter = {
                selected: [],
            };

            filter.load = function(text) {
                $http.get('/api/products/' + name + '/', {
                    params: {
                        search: text,
                    },
                })
                .then(function(response) {
                    filter.data = response.data.data;
                    filter.count = response.data.count;
                })
                ;
            };

            filter.toggle = function(item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                } else {
                    list.push(item);
                }
                $scope.load();
            };

            filter.exists = function(item, list) {
                return list.indexOf(item) > -1;
            };

            filter.clear = function() {
                filter.selected = [];
            };

            filter.load();

            return filter;
        };
        $scope.categories = filterController('categories');
        $scope.brands = filterController('brands');

        $scope.load = function() {
            $http
            .get('/api/products/', {
                params: {
                    skip: $scope.skip,
                    limit: $scope.limit,
                    category: $scope.categories.selected,
                    brand: $scope.brands.selected,
                    search: $scope.search.text,
                    order: $scope.order,
                },
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

        $scope.order = 'price';
        $scope.orderChange = function(order) {
            $scope.order = order;
            $scope.load();
        };

        $scope.$watch('skip', $scope.load);
        $scope.load();
    },
])

;
