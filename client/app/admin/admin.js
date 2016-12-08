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
      })

      .state('admin-account-add', {
        // params:{"navValue":"admin-account-add"},
        url: '/admin/account/add',
        templateUrl: 'app/admin/account/account-add.html',
        controller: 'AdminAccountAddCtrl',
        controllerAs: 'adminAccountAddCtrl'
      })

      .state('admin-account-edit', {
        // params:{"navValue":"admin-account-edit"},
        url: '/admin/account/edit',
        templateUrl: 'app/admin/account/account-edit.html',
        controller: 'AdminAccountEditCtrl',
        controllerAs: 'adminAccountEditCtrl'
      })

      .state('admin-account-changePassword', {
        // params:{"navValue":"admin-account-changePassword"},
        url: '/admin/account/changePassword?state',
        templateUrl: 'app/admin/account/account-changePassword.html',
        controller: 'AdminAccountPsdCtrl',
        controllerAs: 'adminAccountPsdCtrl'
      })

      .state('admin-account-bin', {
        // params:{"navValue":"admin-account-bin"},
        url: '/admin/account/bin',
        templateUrl: 'app/admin/account/account-bin.html',
        controller: 'AdminAccountBinCtrl',
        controllerAs: 'adminAccountBinCtrl'
      })

      .state('admin-account-out', {
        // params:{"navValue":"admin-account-out"},
        url: '/admin/account/out',
        templateUrl: 'app/admin/account/account-out.html',
        controller: 'AdminAccountOutCtrl',
        controllerAs: 'adminAccountOutCtrl'
      });
  };

})();