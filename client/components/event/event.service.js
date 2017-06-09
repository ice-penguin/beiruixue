(function(){

  'use strict';

  angular
    .module('beiruixueApp')
    .factory('Event', Event);

  /* @ngInject */
  function Event($resource) {
    return $resource('/api/events/:id/:controller', {
        id: '@_id'
      },
      {
        shipment:{
          method:'POST'
        },
        index:{
          method:'GET'
        },
        create:{
          method:'POST',
          params:{
            id:'note'
          }
        },
        read:{
          method:'PUT'
        },
        readAll:{
          method:'PUT',
          params:{
            id:'readAll'
          }
        }

      });
  }

})();