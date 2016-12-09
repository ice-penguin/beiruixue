(function(){

  'use strict';

  angular.module('beiruixueApp')
  .config(config);

  function config($stateProvider) {
    $stateProvider
      // 事件管理
      .state('member-event-view', {
        params:{"navValue":"member-event-view"},
        url: '/member/event/view',
        templateUrl: 'app/member/event/event-view.html',
        controller: 'MemberEventViewCtrl',
        controllerAs: 'memberEventViewCtrl'
      });
  };

})();