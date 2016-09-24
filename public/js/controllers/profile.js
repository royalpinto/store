/* global angular */

angular

.module('app')

.controller('profileController', [
    '$scope',
    'Session',
    '$mdDialog',
    '$http',
    '$location',
    function($scope, Session, $mdDialog, $http, $location) {
        Session.getUser()
        .then(function(user) {
            $scope.user = user;

            $scope.logout = function() {
                $http.get('/api/logout/')
                .then(function() {
                    Session.destroy();
                    $location.path('/');
                })
                ;
            };

            $scope.updateuser = function(data) {
                console.log(data);
            };
            $scope.updatepassword = function(data) {
                if (data.password !== data.confirmpassword) {
                    return;
                }
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
                    console.log('Delete');
                }, function() {
                })
                ;
            };
        })
        ;
    },
])
;
