'use strict';

angular.module('beiruixueApp')
  .controller('AdminProductViewCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','Product',
    function ($scope, $location, $state,$stateParams,$cookieStore,Product) {

	var self = this;

	var loadProduct=function (){
		var query={};
		if(self.keywords&&self.keywords != ""){
			query.name = self.keywords;
		}
		Product.index(query,function (data){
			self.products = data.products;
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
		init();
	};

	self.changeState = function (product){
		Product.changeState({controller:product._id},{},function (data){
			product.isActive = !product.isActive
		},function (data){
			alert(data.data);
		});
	};

	init();

}]);