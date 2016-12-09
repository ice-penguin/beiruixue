'use strict';

angular.module('beiruixueApp')
  .controller('AdminAccountAddCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','User',
    function ($scope, $location, $state,$stateParams,$cookieStore,User) {
    var self=this;
    self.subAdmin={
    	account:'',
    	name:'',
    	password:'',
    	confirmPassword:''
    };

    self.save=function (){
    	if(!(self.subAdmin.account&&self.subAdmin.name&&self.subAdmin.password&&self.subAdmin.confirmPassword)){
    		return alert('信息不完整!');
    	}
    	if(self.subAdmin.password!=self.subAdmin.confirmPassword){
    		return alert('密码不一致!');
    	}
    	User.createSubAdmin({},self.subAdmin,function (data){
    		$state.go('admin-account-view');
    	},function (){

    	});
    };

}]);