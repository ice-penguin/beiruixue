'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InfoSchema = new Schema({
	name:String,
	tel:Number,
	saleIncome:Number,//销售
	income:Number,//返利,或差价
	orderQuantity:Number,//主推产品累计
	mainProducts:[{
		_product:String,
		name:String,
		orderQuantity:Number,//累计
		lastQuantity:Number//剩余
	}],//
	otherProducts:[{
		_product:String,
		name:String,
		orderQuantity:Number,//累计
		lastQuantity:Number//剩余
	}],
	_role:{
		type: String,
		ref: 'Role'
	},
	level:String,
	enterDate:Date,//加盟时间
	createDate:Date
});

module.exports = mongoose.model('Info', InfoSchema);
