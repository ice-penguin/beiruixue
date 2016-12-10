'use strict';

angular.module('beiruixueApp')
  .controller('AdminProductAddCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','Product','Upload',
    function ($scope, $location, $state,$stateParams,$cookieStore,Product,Upload) {
    var self=this;

    self.product={
    	name:'',
    	description:'',
    	quantity:'',
    	price:'',
    	state:'1',
    	image:''
    };
    var MAX = Math.pow(2, 32);
    var MIN = 1;

    self.imageFile="assets/uploadfile/";

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