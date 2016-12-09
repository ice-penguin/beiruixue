'use strict';

angular.module('beiruixueApp')
  .controller('AdminAccountPsdCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','User',
    function ($scope, $location, $state,$stateParams,$cookieStore,User) {
    var self=this;
 	self.state=$stateParams.state;

 	self.ownData={
 		oldPassword:'',
 		newPassword:'',
 		confirmPassword:''
 	};

 	var me=function (){
 		User.get({},{},function (data){
 			self.me=data;
 		},function (){

 		});
 	};

 	var init=function (){
 		me();
 	};

 	self.save=function (value){
 		switch(value){
 			case'own':
 				if(!(self.ownData.oldPassword&&self.ownData.newPassword&&self.ownData.confirmPassword)){
		    		return alert('信息不完整!');
		    	}
		    	if(self.ownData.newPassword!=self.ownData.confirmPassword){
		    		return alert('新密码不一致!');
		    	}
 				User.changePassword({id:self.me._id},self.ownData,function (){
 					$state.go('admin-account-view');
 				},function (){
 					return alert('旧密码错误!');
 				});
 				break;
 			case'other':
 				break;
 		};
 	};

 	init();
}]);