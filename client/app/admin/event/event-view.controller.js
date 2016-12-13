'use strict';

angular.module('beiruixueApp')
  .controller('AdminEventViewCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','Event',
    function ($scope, $location, $state,$stateParams,$cookieStore,Event) {

    var self = this;

	var page = $stateParams.page || 1;
    var itemsPerPage = $stateParams.itemsPerPage || 30; 

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
		var query={};
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
		Product.destroyAll({},{eventsIds:eventsIds},function (data){
			alert("操作成功");
			init();
		});
	};

	//换页
    self.pageChanged=function(){
        doLocation();
    };

	init();
}]);