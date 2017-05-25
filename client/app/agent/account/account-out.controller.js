'use strict';

angular.module('beiruixueApp')
  .controller('AgentAccountOutCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','User','Product','Event',
    function ($scope, $location, $state,$stateParams,$cookieStore,User,Product,Event) {
    var self=this;
    var id=$stateParams.id;

    self.showProductName='';
    self.orderQuantity='';
    var productId='';

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
			$state.go('agent-account-view');
		},function (data){
			alert(data.data);
		});
	};

	init();
}]);