(function(){

  'use strict';

  angular
    .module('beiruixueApp')
    .factory('Info', Info);

  /* @ngInject */
  function Info($resource) {
    return $resource('/api/infos/:id/:controller', {
        id: '@_id'
      },
      {
        update:{
          method: 'PUT'
        }

      });
  }

})();