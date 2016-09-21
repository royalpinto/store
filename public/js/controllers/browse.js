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
    },
])

;
