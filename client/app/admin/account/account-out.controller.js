'use strict';

angular.module('beiruixueApp')
  .controller('AdminAccountOutCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','User','Product','Event',
    function ($scope, $location, $state,$stateParams,$cookieStore,User,Product,Event) {
    var self=this;
    var id=$stateParams.id;

    self.showProductName='';
    self.orderQuantity='';
    var productId='';

    var loadAgent=function (){
    	User.show({id:id},{},function (data){
    		self.agent=data.user;
    	},function (){

    	});
    };

    var loadProducts=function (){
    	Product.index({isActive:'true'},{},function (data){
    		self.products=data.products;
    	},function (){

    	});
    };

    var init=function (){
		loadAgent();
		loadProducts();
	};

	self.chooseProduct=function (product){
		self.showProductName=product.name;
		self.showProducts=false;
		productId=product._id;
	};

	self.save=function (){
		if(!(self.showProductName&&self.orderQuantity)){
			return alert('信息不完整!');
		}
		var body={
			_inPerson:self.agent._info._id,
			_product:productId,
			orderQuantity:self.orderQuantity
		};
		Event.shipment({},body,function (){
			$state.go('admin-account-view');
		},function (data){
			alert(data);
		});
	};

	init();
}]);