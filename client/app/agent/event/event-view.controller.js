'use strict';

angular.module('beiruixueApp')
  .controller('AgentEventViewCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','Event','User',
    function ($scope, $location, $state,$stateParams,$cookieStore,Event,User) {

    var self = this;

	var page = $stateParams.page || 1;
    var itemsPerPage = $stateParams.itemsPerPage || 30; 
    var state=$stateParams.state;
    self._info=$stateParams._info;

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
        .search('state', state)
        .search('page', self.pagination.page)
        .search('itemsPerPage', self.pagination.itemsPerPage);
    };

    var loadMe=function (){
    	User.get({},{},function (data){
    		self.user=data;
    		loadEvent();
    	},function (){

    	});
    };

	var loadEvent=function (){
		var query={
			page:self.pagination.page,
            itemsPerPage:self.pagination.itemsPerPage
		};
		if(state){
			query=_.merge(query,{isRead:'false'});
		}
		
		if (self._info) {
			query=_.merge(query,{_info:self._info});
		}else{
			alert('操作错误!');
			return $state.go('agent-account-view');
		}
		
		Event.index(query,function (data){
			self.events = data.events;

			var totalItems = data.count;
            self.pagination.totalItems = totalItems;
            self.pagination.numPages = totalItems / itemsPerPage;
            // 如果是手机端登录直接设为已读
            if(!self.isPC){
            	var eventsIds = [];
				_.each(self.events,function (ev){
						eventsIds.push(ev._id);
				});
				Event.readAll({},{eventsIds:eventsIds},function (data){
				},function (){

				});
            }
		},function (){

		});
	};

	var init=function (){
		self.isSelectAll = false;
		loadMe();
	};

	self.selectAllChange = function (state){
		if(state){
			self.isSelectAll = true;
		}else{
			self.isSelectAll = !self.isSelectAll;
		}
		_.each(self.events,function (ev){
			ev.isSelect = self.isSelectAll;
			console.log(ev.isSelect);
		});
	};

	self.readAll = function(){
		if(!confirm("是否设为已读？")){
			return;
		}
		var eventsIds = [];
		_.each(self.events,function (ev){
			if(ev.isSelect){
				eventsIds.push(ev._id);
			}
		});
		Event.readAll({},{eventsIds:eventsIds},function (data){
			alert("操作成功");
			init();
		},function (){

		});
	};

	//换页
    self.pageChanged=function(){
        doLocation();
    };

	init();
}]);