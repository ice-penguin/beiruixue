'use strict';

angular.module('beiruixueApp')
  .controller('AdminProductEditCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','Product','Upload',
    function ($scope, $location, $state,$stateParams,$cookieStore,Product,Upload) {
    var self=this;
    var id=$stateParams.id;

    var MAX = Math.pow(2, 32);
    var MIN = 1;
    self.imageFile="assets/uploadfile/";

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

    var loadProduct=function (){
    	Product.show({id:id},{},function (data){
    		self.product=data.product;
    		if(self.product.state=='1'){
    			self.productCategory="普通产品";
    		}else{
    			self.productCategory="主推产品";
    		}
    	},function (){

    	});
    };

    var init=function (){
    	loadProduct();
    };

     //上传
    self.upload=function(file){
        console.log(file,file.length);
        if(file.length>0){
            console.log('3333');
            var file=file[0];
            var now = new Date().getTime();
            var nowStr = now.toString();
            var rand = (Math.floor(Math.random() * (MAX - MIN)) + MIN).toString();
            var randStr = rand.toString();
            var filename = nowStr + '_' + randStr + '_' + file.name.replace(/[^0-9a-z\.]+/gi, '');
            console.log('hhhh');
            Upload.upload({
                method: 'POST',
                url: 'api/upload',
                data: {file: file, 'filename': filename}
            }).then(function (resp) {
                console.log(resp.data);
                self.product.image=filename;
            }, function (resp) {
                alert("上传失败");
            }, function (evt) {
                // self.loaded = parseInt(100.0 * evt.loaded / evt.total);
            });
       };
    };

    self.chooseProduct=function (value){
    	switch(value){
    		case '1':
    			self.productCategory="普通产品";
    			self.product.state=1;
    			break;
    		case '2':
    			self.productCategory="主推产品";
    			self.product.state=2;
    			break;
    	};
    	self.showSelectChooses=false;
    };

    self.update=function (){
    	if(!self.productCategory){
    		return alert('产品类别必填!');
    	}
    	Product.update({id:id},self.product,function (){
    		$state.go('admin-product-view');
    	},function (){

    	});
    };

    init();
}]);