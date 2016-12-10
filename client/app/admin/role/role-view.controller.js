'use strict';

angular.module('beiruixueApp')
  .controller('AdminRoleViewCtrl', ['$scope', '$location', '$state','$stateParams','$cookieStore','Role',
    function ($scope, $location, $state,$stateParams,$cookieStore,Role) {
    	var self = this;

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
    	

    	

    	init();

}]);