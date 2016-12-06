(function () {

  'use strict';

  angular
    .module('beiruixueApp')
    .controller('LoginCtrl', LoginCtrl);

  /* @ngInject */
  function LoginCtrl($scope, Auth, $location) {
    var self = this;

    self.login = login;

    function login() {
       Auth.login({
          account: self.account,
          password: self.pwd
        })
        .then( function() {
          // Logged in, redirect to home
          // $location.path('/');
        })
        .catch( function(err) {
          self.showError = true;
        });
    };
    
  }
  
})();
