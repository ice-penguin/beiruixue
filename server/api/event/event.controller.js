'use strict';

var Event = require('./event.model');
var Info = require('../info/info.model');
var Product = require('../product/product.model');
var Role = require('../role/role.model');
var _ = require('lodash');


var handleError = function (res, err) {
  return res.send(500, err);
};

var updateInPerson=function (condition){
	var inPerson=inPerson,
		product=product,
		orderQuantity=orderQuantity;
	var dealArr;
	var open=false;
	switch(product.state){
		case '1':
			dealArr=inPerson.otherProducts;
			break;
		case '2':
			dealArr=inPerson.mainProducts;
			inPerson.orderQuantity+=orderQuantity;
			if(inPerson.level==5&&orderQuantity>=10){
				open=true;
			}else if(inPerson.level>1 && inPerson.level<5){
				open=true;
			}
			break;
	}
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
	if(open){
		Role.find({level:{$gt:inPerson.level}},function (err, roles){
			if(err){inPerson.save();return;}
			var maxQuantity=0;
			_.each(roles,function (role){
				if(inPerson.orderQuantity>role.requireQuantity && maxQuantity<role.requireQuantity){
					maxQuantity=role.requireQuantity;
					inPerson._role=role._id;
				}
			});
			inPerson.save();
		});
	}else{
		inPerson.save();
	}
};

exports.shipment=function (req, res){
	var _inPerson=req.body._inPerson,
		_outPerson=req.body._outPerson,
		_product=req.body._product,
		orderQuantity=req.body.orderQuantity;
	if(!_inPerson){
		return res,json(400,'缺少创建参数：_inPerson');
	}
	if(!_outPerson){
		return res,json(400,'缺少创建参数：_outPerson');
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
	Info.findById(_inPerson,function (err, inPerson){
		if(err){return handleError(err);}
		if(!inPerson){return res.json(400,'进货者不存在!')}
		Info.findById(_outPerson,function (err, outPerson){
			if(err){return handleError(err);}
			if(!outPerson){return res.json(400,'出货者不存在!')}
			Product.findById(_product,function (err, product){
				if(err){return handleError(err);}
				if(!outPerson){return res.json(400,'产品不存在!')}
				var now=new Date();
				var inObj={
					_info:_inPerson,
					content:'进货'+orderQuantity+'套'+product.name,
					_product:_product,
					createDate:now
				};
				var outObj={
					_info:_outPerson,
					content:'出货'+orderQuantity+'套'+product.name,
					_product:_product,
					createDate:now
				};
				Event.create(inObj);
				Event.create(outObj);
				var condition={
					inPerson:inPerson,
					product:product,
					orderQuantity:orderQuantity
				};
				updateInPerson(condition);
				res.json(200,'进货处理中!');
			});	
		});	
	});
};