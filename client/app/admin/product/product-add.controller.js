'use strict';

angular.module('beiruixueApp')
  .controller('AdminProductAddCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','Product','Upload','Compress_ready',
    function ($scope, $location, $state,$stateParams,$cookieStore,Product,Upload,Compress_ready) {
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

    //上传
    self.upload=function(file){
        console.log(file,file.length);
        var index = 0;
        if(file.length>0){
            var file=file[0];

            var doCompress=function(){
                Compress_ready.resizeFile(file).then(function(blob_data) {
                    if(blob_data.size==0){
                        //尝试次数为1次，则再尝试压缩，否则报错
                        if(index==0){
                            index++;
                            return doCompress();
                        }else{
                            return alert("压缩图片失败");
                        }
                    }

                    var now = new Date().getTime();
                    var nowStr = now.toString();
                    var rand = (Math.floor(Math.random() * (MAX - MIN)) + MIN).toString();
                    var randStr = rand.toString();
                    var filename = nowStr + '_' + randStr + '_' + file.name.replace(/[^0-9a-z\.]+/gi, '');
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


                }, function(err_reason) {
                  console.log(err_reason);
                });
            }

            doCompress();
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
        if(!self.product.name){
            return alert('产品名必填!');
        }
        if(!self.product.description){
            return alert('产品描述必填!');
        }
    	if(!self.productCategory){
    		return alert('产品类别必填!');
    	}
    	Product.create({},self.product,function (){
    		$state.go('admin-product-view');
    	},function (){

    	});
    };
}]);