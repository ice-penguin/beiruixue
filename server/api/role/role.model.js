'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
	name:String,
	requireQuantity:String,
	primeCost:Number,
	level:String,
	createDate:Date
});

module.exports = mongoose.model('Role', RoleSchema);
