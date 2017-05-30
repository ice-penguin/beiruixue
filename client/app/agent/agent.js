(function(){

  'use strict';

  angular.module('beiruixueApp')
  .config(config);

  function config($stateProvider) {
    $stateProvider
      // 账号管理
      .state('agent-account-view', {
        params:{"navValue":"agent-account-view"},
        url: '/agent/account/view?itemsPerPage&page',
        templateUrl: 'app/agent/account/account-view.html',
        controller: 'AgentAccountViewCtrl',
        controllerAs: 'agentAccountViewCtrl'
      })

      .state('agent-account-add', {
        params:{"navValue":"agent-account-view"},
        url: '/agent/account/add',
        templateUrl: 'app/agent/account/account-add.html',
        controller: 'AgentAccountAddCtrl',
        controllerAs: 'agentAccountAddCtrl'
      })

      .state('agent-account-edit', {
        params:{"navValue":"agent-account-view"},
        url: '/agent/account/edit/:id?state',
        templateUrl: 'app/agent/account/account-edit.html',
        controller: 'AgentAccountEditCtrl',
        controllerAs: 'agentAccountEditCtrl'
      })

      .state('agent-account-changePassword', {
        params:{"navValue":"agent-account-view"},
        url: '/agent/account/changePassword/:id?state',
        templateUrl: 'app/agent/account/account-changePassword.html',
        controller: 'AgentAccountPsdCtrl',
        controllerAs: 'agentAccountPsdCtrl'
      })

      .state('agent-account-out', {
        params:{"navValue":"agent-account-view"},
        url: '/agent/account/out/:id',
        templateUrl: 'app/agent/account/account-out.html',
        controller: 'AgentAccountOutCtrl',
        controllerAs: 'agentAccountOutCtrl'
      })

      // 角色管理
      .state('agent-role-view', {
        params:{"navValue":"agent-role-view"},
        url: '/agent/role/view',
        templateUrl: 'app/agent/role/role-view.html',
        controller: 'AgentRoleViewCtrl',
        controllerAs: 'agentRoleViewCtrl'
      })


      // 事件管理
      .state('agent-event-view', {
        params:{"navValue":"agent-event-view"},
        url: '/agent/event/view?itemsPerPage&page&state&index&_info&belong',
        templateUrl: 'app/agent/event/event-view.html',
        controller: 'AgentEventViewCtrl',
        controllerAs: 'agentEventViewCtrl'
      });
  };

})();