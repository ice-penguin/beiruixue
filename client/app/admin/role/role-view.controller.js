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
    		});
    	};

    	//更新要求数量
    	self.submitQuantity = function (role){
    		if(isNaN(role.editQuantity)||role.editQuantity<=0){
    			return alert("数量必须为一个大于零的数");
    		}
    		Role.update({id:role._id},{requireQuantity:role.editQuantity},function (data){
    			role.requireQuantity = role.editQuantity;
    			role.editQuantity = null;
    			self.editQuantity = false;
    		});
    	};

    	//更新代理价格
    	self.submitPrice = function (role){
    		if(isNaN(role.editPrice)||role.editPrice<=0){
    			return alert("代理价格必须为一个大于零的数");
    		}
    		Role.update({id:role._id},{primeCost:role.editPrice},function (data){
    			role.primeCost = role.editPrice;
    			role.editPrice = null;
    			self.editPrice = false;
    		});
    	};
    	

    	

    	init();

}]);