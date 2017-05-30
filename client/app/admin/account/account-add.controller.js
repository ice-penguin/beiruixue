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
        enterDateString:null
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

    //格式化时间,已/为标准
    var dealDateString = function(dateString){
      var strArr = dateString.split('/');
      if(strArr.length!=3 || isNaN(strArr[0]) || isNaN(strArr[1]) || isNaN(strArr[2]) ){
        return alert("时间格式不正确");
      }
      var date = new Date();
      date.setYear(strArr[0]);
      date.setMonth(parseInt(strArr[1])-1);
      date.setDate(strArr[2]);
      return date;
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
        if(self.accountInfo.enterDateString){
            self.accountInfo.enterDate = dealDateString(self.accountInfo.enterDateString);
            if(!self.accountInfo.enterDate){
                return;
            }else{
                self.accountInfo.enterDate = self.accountInfo.enterDate.getTime()
            }
        }
    	if(self.user.role=='admin'){
    		User.createSubAdmin({},self.accountInfo,function (data){
	    		alert("创建成功！\n账号："+self.accountInfo.account+"\n密码："+self.accountInfo.password);
	    		$state.go("admin-account-view");
	    	},function(data){
	    		alert(data.data);
	    	});
    	}else{
    		User.createMember({},self.accountInfo,function (data){
	    		alert("创建成功！\n账号："+self.accountInfo.account+"\n密码："+self.accountInfo.password);
	    		$state.go("admin-account-view");
	    	},function(data){
	    		alert(data.data);
	    	});
    	}
    	
    };

    init();
}]);