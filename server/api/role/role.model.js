'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
	name:String,
	requireQuantity:Number,
	primeCost:Number,//进货价
	level:String,
	createDate:Date
});

module.exports = mongoose.model('Role', RoleSchema);
