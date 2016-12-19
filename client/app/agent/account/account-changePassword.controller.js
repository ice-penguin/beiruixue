'use strict';

angular.module('beiruixueApp')
  .controller('AgentAccountPsdCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','Auth','User',
    function ($scope, $location, $state,$stateParams,$cookieStore,Auth,User) {
    var self = this;
    var id = $stateParams.id;
   	self.state = $stateParams.state;
   	self.body = {
   		oldPassword:null,
   		newPassword:null,
   		reNewPassword:null
   	}

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


   	if(self.state == "other"){
   		if(!id){
   			alert("操作错误，请重新操作");
   			return $state.go("agent-account-view");
   		}
   		User.show({id:id},function (data){
   			console.log(data);
   			self.user = data.user;
   		});
   	}else{
   		self.user = Auth.getCurrentUser();
   		id = self.user._id;
   		if(!id){
   			User.get(function(data){
   				self.user = data;
   				id = self.user._id;
   			});
   		}
   		
   	}

   	self.changePassword = function(){
   		if(self.body.reNewPassword && self.body.reNewPassword != self.body.newPassword){
   			return alert("两次密码输入不同");
   		}
   		if(!self.body.newPassword){
   			return alert("请输入新密码");
   		}
   		User.changePassword({id:id},self.body,function (data){
   			alert("修改密码成功");
   			$state.go("agent-account-view");
   		},function (data){
            if(data.status == 403){
               alert(data.data);
            }else{
               alert(data);
            }
   		});
   	};
}]);