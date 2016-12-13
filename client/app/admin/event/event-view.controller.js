'use strict';

angular.module('beiruixueApp')
  .controller('AdminEventViewCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','Event',
    function ($scope, $location, $state,$stateParams,$cookieStore,Event) {

    var self = this;

	var page = $stateParams.page || 1;
    var itemsPerPage = $stateParams.itemsPerPage || 30; 
    var state=$stateParams.state;

	self.pagination = {
      page: page,
      itemsPerPage: itemsPerPage,
      maxSize: 5,
      numPages: null,
      totalItems: null
    };

    var doLocation=function(){
        $location
        .search('page', self.pagination.page)
        .search('itemsPerPage', self.pagination.itemsPerPage);
    };

	var loadEvent=function (){
		var query={
			page:self.pagination.page,
            itemsPerPage:self.pagination.itemsPerPage
		};
		if(state&&state=='true'){
			query=_.merge(query,{isRead:false});
		}
		Event.index(query,function (data){
			self.events = data.events;

			var totalItems = data.count;
            self.pagination.totalItems = totalItems;
            self.pagination.numPages = totalItems / itemsPerPage;
		},function (){

		});
	};

	var init=function (){
		self.isSelectAll = false;
		loadEvent();
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