'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
	name:String,
	description:String,
	quantity:Number,
	price:Number,
	state:String,//1.正常产品 2.按角色区分价格产品
	image:String,
	isActive:Boolean,
	createDate:Date
});

module.exports = mongoose.model('Product', ProductSchema);
