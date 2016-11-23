'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InfoSchema = new Schema({
	name:String,
	tel:Number,
	exceptIncome:Number,
	orderQuantity:Number,
	otherProducts:[{
		_product:String,
		orderQuantity:Number
	}],
	isDelete:Boolean,
	createDate:Date
});

module.exports = mongoose.model('Info', InfoSchema);
