'use strict';

angular.module('beiruixueApp')
  .controller('AdminAccountPsdCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore',
    function ($scope, $location, $state,$stateParams,$cookieStore) {
    var self=this;
 	self.state=$stateParams.state;

}]);