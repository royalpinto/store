/* global angular */

angular

.module('app')

.controller('profileController', [
    '$scope',
    'Session',
    '$mdDialog',
    '$http',
    '$location',
    '$route',
    'Toast',
    function($scope, Session, $mdDialog, $http, $location, $route, Toast) {
        Session.getUser()
        .then(function(user) {
            $scope.user = user;
        })
        .catch(function(error) {
            if (error.status === 401) {
                return $location.path('/');
            }
            Toast.error("Unable to fetch user details!");
        })
        ;

        $scope.logout = function() {
            $http.get('/api/logout/')
            .then(function() {
                Session.destroy();
                $location.path('/');
            })
            ;
        };

        $scope.updateuser = function(data) {
            data = JSON.parse(JSON.stringify(data));
            delete data.username;
            delete data._id;
            $http.put('/api/users/' + $scope.user._id + '/', data)
            .then(function() {
                Toast.success("Profile updated!");
                $route.reload();
            })
            .catch(function() {
                Toast.error("Failed to update profile!");
            })
            ;
        };

        $scope.updatepassword = function(data) {
            if (data.password !== data.confirmpassword) {
                return;
            }
            $scope.updateuser({
                password: data.password,
            });
        };

        $scope.removeuser = function($event) {
            var confirm = $mdDialog
                .confirm()
                .title('Are you sure you want to delete your account?')
                .textContent('Your profile and cart data will be removed!')
                .ariaLabel('Remove account')
                .targetEvent($event)
                .ok('Please do it!')
                .cancel('Cancel');
            $mdDialog.show(confirm)
            .then(function() {
                return $http.delete('/api/users/' + $scope.user._id + '/');
            })
            .then(function() {
                Toast.success("User account removed!");
                Session.destroy();
                $location.path('/');
            })
            .catch(function() {
                Toast.error("Failed to remove user account!");
            })
            ;
        };
    },
])
;
