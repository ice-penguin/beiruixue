'use strict';

var Event = require('./event.model');
var Info = require('../info/info.model');
var Product = require('../product/product.model');
var Role = require('../role/role.model');
var User = require('../user/user.model');
var config = require('../../tool/config');
var _ = require('lodash');





var handleError = function (res, err) {
  return res.send(500, err);
};


var updateInPerson=function (condition){
	var inPerson=condition.inPerson,
		outPerson=condition.outPerson,
		product=condition.product,
		orderQuantity=condition.orderQuantity;
	var dealArr;
	var isUpdateRole=false;
	var isUpdateIncome=false;
	switch(product.state){
		case '1':
			dealArr=inPerson.otherProducts;
			break;
		case '2':
			isUpdateIncome=true;
			dealArr=inPerson.mainProducts;
			inPerson.orderQuantity+=orderQuantity;
			if(inPerson.level==5&&orderQuantity>=10){
				isUpdateRole=true;
			}else if(inPerson.level>1 && inPerson.level<5){
				isUpdateRole=true;
			}
			break;
	}
	console.log(isUpdateIncome);
	var pr=_.find(dealArr,{name:product.name});
	if(pr){
		dealArr.orderQuantity+=orderQuantity;
	}else{
		var obj={
			_product:product._id,
			name:product.name,
			orderQuantity:orderQuantity
		};
		dealArr.push(obj);
	}
	if(isUpdateRole){
		Role.find({level:{$lt:inPerson.level}},function (err, roles){
			if(err){inPerson.save();return;}
			var maxQuantity=0;
			console.log(roles);
			_.each(roles,function (role){
				if(inPerson.orderQuantity>=role.requireQuantity && maxQuantity<role.requireQuantity){
					maxQuantity=role.requireQuantity;
					inPerson._role=role._id;
					inPerson.level=role.level;
				}
			});
			updateIncome(condition);
		});
	}else{
		if(isUpdateIncome){
			updateIncome(condition);
		}else{
			inPerson.save();
		}
	}
};

var updateIncome=function (condition){
	var inPerson=condition.inPerson,
		outPerson=condition.outPerson,
		orderQuantity=condition.orderQuantity;
	Role.findById(inPerson._role,function (err, inRole){
		if(err||!inRole){inPerson.save(); return;}
		if(inRole.level==5){
			inPerson.saleIncome+=config.memberExceptIncome*orderQuantity;
		}else{
			var amount=orderQuantity*(config.tetailPrice-inRole.primeCost);
			inPerson.saleIncome+=amount;
		}
		inPerson.save();
		if(outPerson){
			Role.findById(outPerson._role,function (err, outRole){
				if(err||!outRole){return;}
				if(outRole.level<inRole.level){
					var amount=(inRole.primeCost-outRole.primeCost)*orderQuantity;
				}else{
					var amount=(inPerson.primeCost*orderQuantity)*config.ratePrecent;
				}
				outPerson.income+=amount;
				outPerson.save();
			});
		}else{
			User.findOne({_info:inPerson._id},'',{populate:'_creator'},function (err, user){
				if(err||!user){return;}
				if(!user._creator){return;}
				Role.findById(user._creator._role,function (err, outRole){
					if(err||!outRole){return;}
					if(outRole.level<inRole.level){
						var amount=(inRole.primeCost-outRole.primeCost)*orderQuantity;
					}else{
						var amount=(inPerson.primeCost*orderQuantity)*config.ratePrecent;
					}
					user._creator.income+=amount;
					user._creator.save();
				});
			});
		}
	});
};





exports.shipment=function (req, res){
	var _inPerson=req.body._inPerson,
		_product=req.body._product,
		orderQuantity=req.body.orderQuantity,
		outPerson=req.user._info;
	if(!_inPerson){
		return res,json(400,'缺少创建参数：_inPerson');
	}
	if(!_product){
		return res,json(400,'缺少创建参数：_product');
	}
	if(!orderQuantity){
		return res,json(400,'缺少创建参数：orderQuantity');
	}
	if(isNaN(orderQuantity)){
		return res,json(400,'创建参数类型不正确：必须为数字!');
	}
	orderQuantity=parseInt(orderQuantity);
	Info.findById(_inPerson,function (err, inPerson){
		if(err){return handleError(err);}
		if(!inPerson){return res.json(400,'进货者不存在!')}
		Product.findById(_product,function (err, product){
			if(err){return handleError(err);}
			if(!product){return res.json(400,'产品不存在!')}
			if(outPerson && inPerson.level<=outPerson.level){
				return res.json(400,'进货人代理等级需小于出货人代理等级!');
			}
			var now=new Date();
			var inObj={
				_info:_inPerson,
				content:'进货'+orderQuantity+'套'+product.name,
				_product:_product,
				createDate:now
			};
			Event.create(inObj);
			if(outPerson){
				var outObj={
					_info:outPerson._id,
					content:'出货'+orderQuantity+'套'+product.name,
					_product:_product,
					createDate:now
				};
				Event.create(outObj);
			}
			var condition={
				inPerson:inPerson,
				outPerson:outPerson,
				product:product,
				orderQuantity:orderQuantity
			};
			updateInPerson(condition);
			res.json(200,'进货处理中!');
		});	
	});
};