(function () {

  'use strict';

  angular
    .module('beiruixueApp')
    .controller('MainCtrl', MainCtrl);

  /* @ngInject */
  function MainCtrl($scope, $http, Auth, $state) {
    var redirect = function () {
        if (Auth.isAdmin()) {
        	console.log("admin");
          	$state.go('admin-account-view');
        } else if (Auth.isMember()) {
        	console.log("会员");
          	// $state.go('member-event-view');
            $state.go('agent-account-view'); 
        } else if (Auth.isAgent()) {
        	console.log("代理");
          	$state.go('agent-account-view');
        } else {
        	console.log("未登录");
          	$state.go('login');
        }
        
	};
	if(!Auth.isLoggedIn()&&Auth.getToken()){
		Auth.setCurrentUser(function (currentUser){
			redirect();
		});
	}else{
		redirect();	
	}
  }

})();