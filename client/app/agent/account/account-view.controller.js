'use strict';

angular.module('beiruixueApp')
  .controller('AgentAccountViewCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','User','Auth' ,
    function ($scope, $location, $state,$stateParams,$cookieStore,User,Auth) {
	var self=this;

	self.keywords = $stateParams.kw; 
	var page = $stateParams.page || 1;
    var itemsPerPage = $stateParams.itemsPerPage || 30; 

    self.user = {};

	self.pagination = {
      page: page,
      itemsPerPage: itemsPerPage,
      maxSize: 5,
      numPages: null,
      totalItems: null
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

    var doLocation=function(){
        $location
        .search('kw', self.keywords)
        .search('page', self.pagination.page)
        .search('itemsPerPage', self.pagination.itemsPerPage);
    };

    var loadMe=function (){
    	User.get({},{},function (data){
    		self.user=data;
    	},function (){

    	});
    };

	var loadAgents=function (){
		var query={
			page:self.pagination.page,
            itemsPerPage:self.pagination.itemsPerPage
		};
		if(self.keywords&&self.keywords != ""){
			query.retrieval = self.keywords;
		}
		User.index(query,function (data){
			self.agents=data.users;
			var totalItems = data.count;
            self.pagination.totalItems = totalItems;
            self.pagination.numPages = totalItems / itemsPerPage;

			_.each(self.agents,function (agent){
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
				if(agent._creator && agent._creator._info){
					agent.creatorName = agent._creator._info.name;
				}else{
					agent.creatorName = "";
				}
			});
		},function (){

		});
	};

	var init=function (){
		self.isSelectAll = false;
		loadAgents();
		loadMe();
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

	self.search = function(){
		if(self.keywords == ""){
			self.keywords = null;
		}
		doLocation();
	};

	//换页
    self.pageChanged=function(){
        doLocation();
    };

    self.logout=Auth.logout;

	init();
}]);