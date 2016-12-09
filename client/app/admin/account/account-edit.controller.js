'use strict';

angular.module('beiruixueApp')
  .controller('AdminAccountEditCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','User',
    function ($scope, $location, $state,$stateParams,$cookieStore,User) {
    var self=this;
    var id=$stateParams.id;

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

	init();
}]);