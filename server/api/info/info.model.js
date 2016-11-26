'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InfoSchema = new Schema({
	name:String,
	tel:Number,
	saleIncome:Number,//销售
	income:Number,//返利,或差价
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
	createDate:Date
});

module.exports = mongoose.model('Info', InfoSchema);
