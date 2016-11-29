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
	if(!product.image){
		return false;
	}
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
    	state=req.query.state;
    var condition={};
	var count;
	if(state){
		condition=_.merge(condition,{state:state});
	}
	if(name){
		condition=_.merge(condition,{name:{'$regex' : '.*' + name + '.*'}});
	}
	console.log(condition);
	Product.find(condition).count(function (err, c){
		if (err) {return handleError(res, err);}
		count = c;
	});
	Product.find(condition,{},{
		skip: (page - 1) * itemsPerPage,
		limit: itemsPerPage
	})
	.exec(function (err, products){
		if (err) {return handleError(res, err);}
		return res.json(200, {
	        products: products,
	        count: count
	    });
	});
};


exports.changeState=function (req, res){
	var id=req.params.id;
	Product.findById(id,function (err, product){
		if(err){return handleError(err);}
		if(!product){return res.json(404,'产品不存在!')}
		if(product.isActive==false){
			if(checkProduct(product)==false){return res.json(400,'信息不完整或数据类型错误!');}
		}
		product.isActive=!product.isActive;
		product.save(function (err, product){
			if(err){return handleError(err);}
			return res.json(200,{
				product:product
			});
		});
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