'use strict';

var Product = require('./product.model');
var _ = require('lodash');


var handleError = function (res, err) {
  return res.send(500, err);
};


exports.create=function (req, res){
	var product=req.body;
	product=_.pick(product,'name','description','quantity','state','price','image');
	if(isNaN(product.quantity)){
		return res.json(400,"参数错误：quantity");
	}
	if(product.state == 2){
		delete product.price;
	}else{
		product.state=1;
		if(product.price && isNaN(product.price)){
			return res.json(400,"参数错误：price");
		}
	}
	product.isActive=false;
	product.createDate=new Date();
	Product.create(product,function (err, product){
		if(err){return handleError(res, err);}
		return res.json(200,{product:product});
	});
};


exports.destroy=function (req, res){
	var id=req.params.id;
	Product.findOneAndRemove({_id:id},function (err, product){
		if(err){return handleError(res, err);}
		if(!product){return res.json(400,'找不到产品!');}
		return res.json(200,'删除成功!');
	});
};