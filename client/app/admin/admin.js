(function(){

  'use strict';

  angular.module('beiruixueApp')
  .config(config);

  function config($stateProvider) {
    $stateProvider
      // 账号管理
      .state('admin-account-view', {
        params:{"navValue":"admin-account-view"},
        url: '/admin/account/view',
        templateUrl: 'app/admin/account/account-view.html',
        controller: 'AdminAccountViewCtrl',
        controllerAs: 'adminAccountViewCtrl'
      })

      .state('admin-account-add', {
        params:{"navValue":"admin-account-view"},
        url: '/admin/account/add',
        templateUrl: 'app/admin/account/account-add.html',
        controller: 'AdminAccountAddCtrl',
        controllerAs: 'adminAccountAddCtrl'
      })

      .state('admin-account-edit', {
        params:{"navValue":"admin-account-view"},
        url: '/admin/account/edit',
        templateUrl: 'app/admin/account/account-edit.html',
        controller: 'AdminAccountEditCtrl',
        controllerAs: 'adminAccountEditCtrl'
      })

      .state('admin-account-changePassword', {
        params:{"navValue":"admin-account-view"},
        url: '/admin/account/changePassword?state',
        templateUrl: 'app/admin/account/account-changePassword.html',
        controller: 'AdminAccountPsdCtrl',
        controllerAs: 'adminAccountPsdCtrl'
      })

      .state('admin-account-bin', {
        params:{"navValue":"admin-account-view"},
        url: '/admin/account/bin',
        templateUrl: 'app/admin/account/account-bin.html',
        controller: 'AdminAccountBinCtrl',
        controllerAs: 'adminAccountBinCtrl'
      })

      .state('admin-account-out', {
        params:{"navValue":"admin-account-view"},
        url: '/admin/account/out',
        templateUrl: 'app/admin/account/account-out.html',
        controller: 'AdminAccountOutCtrl',
        controllerAs: 'adminAccountOutCtrl'
      })

      // 角色管理
      .state('admin-role-view', {
        params:{"navValue":"admin-role-view"},
        url: '/admin/role/view',
        templateUrl: 'app/admin/role/role-view.html',
        controller: 'AdminRoleViewCtrl',
        controllerAs: 'adminRoleViewCtrl'
      })

      // 角色管理
      .state('admin-product-view', {
        params:{"navValue":"admin-product-view"},
        url: '/admin/product/view',
        templateUrl: 'app/admin/product/product-view.html',
        controller: 'AdminProductViewCtrl',
        controllerAs: 'adminProductViewCtrl'
      })

      // 事件管理
      .state('admin-event-view', {
        params:{"navValue":"admin-event-view"},
        url: '/admin/event/view',
        templateUrl: 'app/admin/event/event-view.html',
        controller: 'AdminEventViewCtrl',
        controllerAs: 'adminEventViewCtrl'
      });
  };

})();