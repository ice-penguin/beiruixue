'use strict';

angular.module('beiruixueApp')
  .controller('AdminAccountAddCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','User',
    function ($scope, $location, $state,$stateParams,$cookieStore,User) {
    var self = this;

    this.accountInfo = {
    	account:null,
    	name:null,
    	tel:null,
    	password:null,
    	rePassword:null,
    };

    var loadMe=function (){
    	User.get({},{},function (data){
    		self.user=data;
    	},function (){

    	});
    };

    var init=function (){
    	loadMe();
    };

    self.create = function (){
    	if(!self.accountInfo.account || !self.accountInfo.name || !self.accountInfo.tel || !self.accountInfo.password){
    		return alert("请填写完整信息");
    	}
    	if(self.accountInfo.password != self.accountInfo.rePassword){
    		return alert("两次密码输入不同");
    	}
    	if(self.user.role=='admin'){
    		User.createSubAdmin({},self.accountInfo,function (data){
	    		alert("创建成功！\n账号："+self.accountInfo.account+"\n密码："+self.accountInfo.password);
	    		$state.go("admin-account-view");
	    	},function(data){
	    		alert(data);
	    	});
    	}else{
    		User.createMember({},self.accountInfo,function (data){
	    		alert("创建成功！\n账号："+self.accountInfo.account+"\n密码："+self.accountInfo.password);
	    		$state.go("admin-account-view");
	    	},function(data){
	    		alert(data);
	    	});
    	}
    	
    };

    init();
}]);