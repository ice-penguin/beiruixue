(function () {

  'use strict';

  angular
    .module('beiruixueApp')
    .controller('LoginCtrl', LoginCtrl);

  /* @ngInject */
  function LoginCtrl($scope, Auth, $location, $state) {
    var self = this;

    self.login = login;

    function login() {
       Auth.login({
          account: self.account,
          password: self.pwd
        })
        .then( function() {
          // Logged in, redirect to home
          // $location.path('/view');
          $state.go('admin-account-view');
        })
        .catch( function(err) {
          self.showError = true;
        });
    };
    
  }
  
})();
