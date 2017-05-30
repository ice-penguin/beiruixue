'use strict';

angular.module('beiruixueApp')
  .controller('AgentRoleViewCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','Role',
    function ($scope, $location, $state,$stateParams,$cookieStore,Role) {
    	var self = this;

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

        
    	var init = function(){
    		loadRoles();
    	};

    	var loadRoles = function(){
    		Role.index({},function (data){
    			self.roles = data.roles;
                _.each(self.roles,function (role){
                    role.editQuantity=role.requireQuantity;
                    role.editPrice = role.primeCost;
                });
    		});
    	};

    	//更新要求数量
    	self.submitQuantity = function (role){
    		if(isNaN(role.editQuantity)||role.editQuantity<=0){
    			return alert("数量必须为一个大于零的数");
    		}
    		Role.update({id:role._id},{requireQuantity:role.editQuantity},function (data){
    			role.requireQuantity = role.editQuantity;
    			role.showEditQuantity = false;
    		});
    	};

    	//更新代理价格
    	self.submitPrice = function (role){
    		if(isNaN(role.editPrice)||role.editPrice<=0){
    			return alert("代理价格必须为一个大于零的数");
    		}
    		Role.update({id:role._id},{primeCost:role.editPrice},function (data){
    			role.primeCost = role.editPrice;
    			role.showEditPrice = false;
    		});
    	};


        self.save=function (){
            if(!self.editRole){
                return;
            }
            if(isNaN(self.editRole.requireQuantity)||self.editRole.requireQuantity<=0){
                return alert("数量必须为一个大于零的数");
            }
            if(isNaN(self.editRole.primeCost)||self.editRole.primeCost<=0){
                return alert("代理价格必须为一个大于零的数");
            }
            Role.update({id:self.editRole._id},{requireQuantity:self.editRole.requireQuantity,primeCost:self.editRole.primeCost},function (data){
                alert('修改成功!');
                self.mbShowDList=false;
                self.mbShowDetail=false;
                self.editRole=null;
            });
        };
    	

    	

    	init();

}]);