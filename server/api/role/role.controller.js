'use strict';

var Role = require('./role.model');
var _ = require('lodash');

var handleError = function (res, err) {
  return res.send(500, err);
};

exports.index = function (req,res){
	var page = req.query.page||1,
		itemsPerPage = req.query.itemsPerPage||100;

	Role.find({},"",{sort:{level:1}},function (err,roles){
		if(err){return handleError(res, err);}
		return res.json(200,{roles:roles});
	});
};

exports.update = function (req,res){
	var id = req.params.id;
	var body = _.pick(req.body,'requireQuantity','primeCost');

	if(body.requireQuantity&&isNaN(body.requireQuantity)){
		return res.json(400,'参数错误：requireQuantity');
	}
	if(body.primeCost&&isNaN(body.primeCost)){
		return res.json(400,'参数错误：primeCost');
	}

	Role.findById(id,function (err,role){
		if(err){return handleError(res, err);}
		if(!role){return res.json(400,"不存在对象：role")}
		role=_.assign(role,body);
		role.save(function (err,role){
			if(err){return handleError(res, err);}
			res.json(200,{
				role:role
			});
		});
	});

};