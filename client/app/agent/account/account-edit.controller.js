'use strict';

angular.module('beiruixueApp')
  .controller('AgentAccountEditCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','User','Info',
    function ($scope, $location, $state,$stateParams,$cookieStore,User,Info) {
    var self=this;
    var id=$stateParams.id;

    var loadAgent=function (){
    	User.show({id:id},{},function (data){
    		self.agent=data.user;
    		console.log(data);
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
		Info.update({id:self.agent._info._id},obj,function (){
			$state.go('agent-account-view');
		},function (data){
			alert(data);
		});
	};

	init();
}]);