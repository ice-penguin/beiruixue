(function(){

  'use strict';

  angular
    .module('beiruixueApp')
    .factory('Product', Product);

  /* @ngInject */
  function Product($resource) {
    return $resource('/api/products/:id/:controller', {
        id: '@_id'
      },
      {
        create:{
          method:'POST'
        },
        index:{
          method: 'GET'
        },
        show:{
          method: 'GET'
        },
        update:{
          method: 'PUT'
        },
        changeState:{
          method: 'PUT',
          params:{
            id:'changeState'
          }
        },
        destroyAll:{
          method:"PUT",
          params:{
            id:"destroyAll"
          }
        },
        destroy:{
          method:"DELETE"
        }

      });
  }

})();