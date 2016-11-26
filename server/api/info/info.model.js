'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InfoSchema = new Schema({
	name:String,
	tel:Number,
	saleIncome:Number,//销售
	rebateIncome:Number,//返利
	orderQuantity:Number,
	mainProducts:[{
		_product:String,
		name:String,
		orderQuantity:Number
	}],
	otherProducts:[{
		_product:String,
		name:String,
		orderQuantity:Number
	}],
	_role:{
		type: String,
		ref: 'Role'
	},
	level:String,
	isDelete:Boolean,
	createDate:Date
});

module.exports = mongoose.model('Info', InfoSchema);
