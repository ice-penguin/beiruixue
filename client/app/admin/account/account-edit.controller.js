'use strict';

angular.module('beiruixueApp')
  .controller('AdminAccountEditCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','User','Info',
    function ($scope, $location, $state,$stateParams,$cookieStore,User,Info) {
    var self=this;
    var id=$stateParams.id;

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

    var loadAgent=function (){
    	User.show({id:id},{},function (data){
    		self.agent=data.user;
    		if(!self.agent._info){
				self.agent.level='子账号';
			}else{
				self.agent.name=self.agent._info.name;
				self.agent.tel=self.agent._info.tel;
	    		switch(self.agent._info.level.toString()){
					case '5':
						self.agent.level='会员';
						break;
					case '4':
						self.agent.level='三级代理';
						break;
					case '3':
						self.agent.level='二级代理';
						break;
					case '2':
						self.agent.level='一级代理';
						break;
					case '1':
						self.agent.level='特级代理';
						break;
				};
			};
    	},function (){

    	});
    };

    var init=function (){
		loadAgent();
	};

	self.save=function (){
		var obj={
			name:self.agent.name,
			tel:self.agent.tel
		};
		if(self.agent.level=='子账号'){
			User.update({id:id},obj,function (){
				$state.go('admin-account-view');
			},function (data){
				alert(data);
			});
		}else{
			Info.update({id:self.agent._info._id},obj,function (){
				$state.go('admin-account-view');
			},function (data){
				alert(data);
			});
		}
	};

	init();
}]);