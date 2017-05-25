'use strict';

angular.module('beiruixueApp')
  .controller('AgentAccountEditCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','User','Info',
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

    var loadAgent=function (){
    	User.show({id:id},{},function (data){
    		self.agent=data.user;
    		if(self.agent._info.enterDate){
				self.agent._info.enterDate = new Date(self.agent._info.enterDate);
    			self.agent._info.enterDateString = self.agent._info.enterDate.getFullYear()+'/'+(self.agent._info.enterDate.getMonth()+1)+'/'+self.agent._info.enterDate.getDate();
    		}
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
		if(self.agent._info.enterDateString){
            obj.enterDate = dealDateString(self.agent._info.enterDateString);
            if(!obj.enterDate){
                return;
            }else{
                obj.enterDate = obj.enterDate.getTime()
            }
        }
		Info.update({id:self.agent._info._id},obj,function (){
			$state.go('agent-account-view');
		},function (data){
			alert(data);
		});
	};

	self.destory=function(){
		if(!confirm("确认删除？")){
            return;
        }
        User.destroy({controller:id},{},function (){
            alert("删除成功");
            $state.go('agent-account-view');
        },function (){

        });
	};

	init();
}]);