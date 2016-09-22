/* global angular */

angular

.module('app')

.controller('accountController', [
    '$scope',
    '$http',
    'Session',
    '$mdDialog',
    function($scope, $http, Session, $mdDialog) {
        $scope.close = function() {
            $mdDialog.hide();
        };

        $scope.logout = function() {
            $http.get('/api/logout/');
            Session.destroy();
            $scope.close();
        };

        $scope.user = Session.user;

        $scope.login = {
            do: function(data) {
                $http.post('/api/login/', {
                    username: data.username,
                    password: data.password,
                })
                .then(function(response) {
                    Session.create(response.data);
                    $scope.close();
                })
                .catch(function(error) {
                    $scope.login.error = error.data.error;
                })
                ;
            },
        };

        $scope.register = {
            do: function(data) {
                $http.post('/api/register/', {
                    username: data.username,
                    password: data.password,
                    name: data.name,
                    email: data.email,
                })
                .then(function(response) {
                    Session.create(response.data);
                    $scope.close();
                })
                .catch(function(error) {
                    $scope.register.error = error.data.error;
                })
                ;
            },
        };
    },
])

;
