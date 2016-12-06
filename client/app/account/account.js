(function () {

  'use strict';

  angular
    .module('beiruixueApp')
    .config(config);

  /* @ngInject */
  function config($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'loginCtrl'
      });
  }
})();