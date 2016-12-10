'use strict';

angular.module('beiruixueApp')
  .controller('AdminAccountViewCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','User',
    function ($scope, $location, $state,$stateParams,$cookieStore,User) {
	var self=this;

	var loadAgents=function (){
		var query={};
		if(self.keywords&&self.keywords != ""){
			query.retrieval = self.keywords;
		}
		User.index(query,function (data){
			self.agents=data.users;
			_.each(self.agents,function (agent){
				if(!agent._info){
					agent.level='子账号';
				}else{
					switch(agent._info.level.toString()){
						case '5':
							agent.level='会员';
							break;
						case '4':
							agent.level='三级代理';
							break;
						case '3':
							agent.level='二级代理';
							break;
						case '2':
							agent.level='一级代理';
							break;
						case '1':
							agent.level='特级代理';
							break;
					};
				}
			});
		},function (){

		});
	};

	var init=function (){
		self.isSelectAll = false;
		loadAgents();
	};

	self.selectAllChange = function (state){
		if(state){
			self.isSelectAll = true;
		}else{
			self.isSelectAll = !self.isSelectAll;
		}
		_.each(self.agents,function (agent){
			agent.isSelect = self.isSelectAll;
		});
	};

	self.destoryAccount = function(){
		if(!confirm("确认删除（回收站可查看）？")){
			return;
		}
		var userIds = [];
		_.each(self.agents,function (agent){
			if(agent.isSelect){
				userIds.push(agent._id);
			}
		});
		User.destroyAll({},{userIds:userIds},function (data){
			alert("删除成功");
			init();
		});
	};

	self.search = function(){
		if(self.keywords == ""){
			self.keywords = null;
		}
		init();
	};

	init();
}]);