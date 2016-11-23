'use strict';

var Product = require('./product.model');
var _ = require('lodash');


var handleError = function (res, err) {
  return res.send(500, err);
};


exports.create=function (req, res){
	var product=req.body;
	product=_.pick(product,'name','description','quantity','price','image');
	product.state=1;
	product.isActive=false;
	product.createDate=new Date();
	Product.create(product,function (err, product){
		if(err){return handleError(res, err);}
		return res.json(200,product);
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