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

    var system ={}; 
    var p = navigator.platform;   
    system.win = p.indexOf("Win") == 0; 
    system.mac = p.indexOf("Mac") == 0; 
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);   
    if(system.win||system.mac||system.xll){//如果是电脑跳转到百度 
        // window.location.href="http://www.baidu.com/"; 
        self.isPC = true;
    }else{  //如果是手机,跳转到谷歌
        // window.location.href="http://www.google.cn/"; 
        self.isPC = false;
        
    }

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