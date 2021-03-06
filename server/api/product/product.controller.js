'use strict';

var Product = require('./product.model');
var _ = require('lodash');


var handleError = function (res, err) {
  return res.send(500, err);
};

var checkProduct=function (product){
	if(!product.name){
		return false;
	}
	if(!product.description){
		return false;
	}
	if(!product.quantity&&product.quantity!=0){
		return false;
	}
	if(isNaN(product.quantity)){
		return false;
	}
	// if(!product.image){
	// 	return false;
	// }
	if(product.state==1){
		if(!product.price){
			return false;
		}
		if(isNaN(product.price)){
			return false;
		}
	}
	return true;
};


exports.create=function (req, res){
	var product=req.body;
	product=_.pick(product,'name','description','quantity','state','price','image');
	if(product.quantity&&isNaN(product.quantity)){
		return res.json(400,"参数错误：quantity");
	}
	if(!product.state){return res.json(400,'缺少创建参数:state!');}
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


exports.index=function (req, res){
	var page = req.query.page || 1,
    	itemsPerPage = req.query.itemsPerPage || 100,
    	name=req.query.name,
    	state=req.query.state,
    	isActive=req.query.isActive;
    var condition={};
	var count;
	if(state){
		condition=_.merge(condition,{state:state});
	}
	if(name){
		condition=_.merge(condition,{name:{'$regex' : '.*' + name + '.*',$options:'i'}});
	}
	if(isActive=='true'){
		condition=_.merge(condition,{isActive:true});
	}else if(isActive=='false'){
		condition=_.merge(condition,{isActive:false});
	}
	// console.log(condition);
	Product.find(condition).count(function (err, c){
		if (err) {return handleError(res, err);}
		count = c;
	});
	Product.find(condition,{},{
		skip: (page - 1) * itemsPerPage,
		limit: itemsPerPage
	})
	.sort({createDate:-1})
	.exec(function (err, products){
		if (err) {return handleError(res, err);}
		return res.json(200, {
	        products: products,
	        count: count
	    });
	});
};

exports.show=function (req, res){
	var id=req.params.id;
	Product.findById(id,function (err, product){
		if(err){return handleError(res,err);}
		if(!product){return res.json(404,'产品不存在!');}
		return res.json(200,{product:product});
	});
};

exports.update=function (req, res){
	var id=req.params.id;
	var body=_.pick(req.body,'name','description','quantity','state','price','image');
	if(body.quantity&&isNaN(body.quantity)){
		return res.json(400,"参数错误：quantity");
	}
	if(!body.state){return res.json(400,'缺少创建参数:state!');}
	if(body.state == 2){
		delete body.price;
	}else{
		body.state=1;
		if(body.price && isNaN(body.price)){
			return res.json(400,"参数错误：price");
		}
	}
	body.isActive=false;
	Product.findById(id,function (err, product){
		if(err){return handleError(res,err);}
		if(!product){return res.json(404,'产品不存在!');}
		product=_.assign(product,body);
		product.save(function (err, product){
			if(err){return handleError(res,err);}
			return res.json(200,{product:product});
		});
	});
};


exports.changeState=function (req, res){
	var id=req.params.id;
	Product.findById(id,function (err, product){
		if(err){return handleError(res,err);}
		if(!product){return res.json(404,'产品不存在!')}
		if(product.isActive==false){
			if(checkProduct(product)==false){return res.json(400,'信息不完整或数据类型错误!');}
		}
		product.isActive=!product.isActive;
		product.save(function (err, product){
			if(err){return handleError(res,err);}
			return res.json(200,{
				product:product
			});
		});
	});
};

exports.destroyAll = function (req,res){
	var ids = req.body.productIds || [];
	Product.find({_id:{$in:ids}},function (err,products){
		if(err){return handleError(res, err);}
		_.each(products,function (product){
			product.remove();
		});
		res.json(200,"删除成功");
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