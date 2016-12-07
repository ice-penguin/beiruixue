(function(){

  'use strict';

  angular.module('beiruixueApp')
  .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('admin-account-view', {
        // params:{"navValue":"admin-account-view"},
        url: '/admin/account/view',
        templateUrl: 'app/admin/account/account-view.html',
        controller: 'AdminAccountViewCtrl',
        controllerAs: 'adminAccountViewCtrl'
      });
  };

})();