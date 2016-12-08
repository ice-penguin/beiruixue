(function(){

  'use strict';

  angular
    .module('beiruixueApp')
    .factory('User', User);

  /* @ngInject */
  function User($resource) {
    return $resource('/api/users/:id/:controller', {
        id: '@_id'
      },
      {
        index: {
          method: 'GET'
        },
        destroy: {
          method: 'PUT',
          params: {
            id:'destroy'
          }
        },
        destroyAll: {
          method: 'PUT',
          params: {
            id:'destroyAll'
          }
        },
        recovery: {
          method: 'PUT',
          params: {
            id:'recovery'
          }
        },
        recoveryAll: {
          method: 'PUT',
          params: {
            id:'recoveryAll'
          }
        },
        get: {
          method: 'GET',
          params: {
            id:'me'
          }
        },
        show: {
          method: 'GET'
        },
        changePassword: {
          method: 'PUT',
          params: {
            controller:'password'
          }
        },
        createSubAdmin: {
          method: 'POST',
          params: {
            id:'subAdmin'
          }
        },
        createMember: {
          method: 'POST'
        }

      });
  }

})();