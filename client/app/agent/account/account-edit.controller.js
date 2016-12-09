'use strict';

angular.module('beiruixueApp')
  .controller('AgentAccountEditCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore',
    function ($scope, $location, $state,$stateParams,$cookieStore) {
    var self=this;
 	self.state=$stateParams.state;

}]);