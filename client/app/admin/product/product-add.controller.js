'use strict';

angular.module('beiruixueApp')
  .controller('AdminProductAddCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','Product',
    function ($scope, $location, $state,$stateParams,$cookieStore,Product) {
    var self=this;

    self.product={
    	name:'',
    	description:'',
    	quantity:'',
    	price:'',
    	state:'',
    	image:''
    };

    self.chooseProduct=function (value){
    	switch(value){
    		case '1':
    			self.productCategory="普通产品";
    			self.product.state=1;
    			break;
    		case '2':
    			self.productCategory="特殊产品";
    			self.product.state=2;
    			break;
    	};
    	self.showSelectChooses=false;
    };

    self.save=function (){
    	if(!self.productCategory){
    		return alert('产品类别必填!');
    	}
    	Product.create({},self.product,function (){
    		$state.go('admin-product-view');
    	},function (){

    	});
    };
}]);