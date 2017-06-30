'use strict';

angular.module('beiruixueApp')
  .controller('AgentProductViewCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','Product',
    function ($scope, $location, $state,$stateParams,$cookieStore,Product) {

	var self = this;

	self.keywords = $stateParams.kw; 
	var page = $stateParams.page || 1;
    var itemsPerPage = $stateParams.itemsPerPage || 30;
    self.imageFile="assets/uploadfile/"; 

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

	var loadProduct=function (){
		var query={
			page:self.pagination.page,
            itemsPerPage:self.pagination.itemsPerPage,
            isActive:'true'
		};
		if(self.keywords&&self.keywords != ""){
			query.name = self.keywords;
		}
		Product.index(query,function (data){
			self.products = data.products;
			var totalItems = data.count;
            self.pagination.totalItems = totalItems;
            self.pagination.numPages = totalItems / itemsPerPage;
		},function (){

		});
	};

	var init=function (){
		self.isSelectAll = false;
		loadProduct();
	};

	self.selectAllChange = function (state){
		if(state){
			self.isSelectAll = true;
		}else{
			self.isSelectAll = !self.isSelectAll;
		}
		_.each(self.products,function (product){
			product.isSelect = self.isSelectAll;
		});
	};

	self.destoryProduct = function(){
		if(!confirm("确认删除？")){
			return;
		}
		var productIds = [];
		_.each(self.products,function (product){
			if(product.isSelect){
				productIds.push(product._id);
			}
		});
		Product.destroyAll({},{productIds:productIds},function (data){
			alert("删除成功");
			init();
		});
	};

	self.search = function(){
		if(self.keywords == ""){
			self.keywords = null;
		}
		doLocation();
	};

	self.changeState = function (product){
		Product.changeState({controller:product._id},{},function (data){
			product.isActive = !product.isActive
		},function (data){
			alert(data.data);
		});
	};

	//换页
    self.pageChanged=function(){
        doLocation();
    };


	init();

}]);