(function(){

  'use strict';

  angular
    .module('beiruixueApp')
    .factory('Role', Role);

  /* @ngInject */
  function Role($resource) {
    return $resource('/api/roles/:id/:controller', {
        id: '@_id'
      },
      {
        index:{
          method: 'GET'
        },
        update:{
          method: 'PUT'
        }

      });
  }

})();