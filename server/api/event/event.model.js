'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
	_info:{
		type:String,
		ref:'Info'
	},
	content:String,
	_product:{
		type:String,
		ref:'Product'
	},
	hasRead:[{
	    type:String,
	    ref:'User'
	}],
	belong:{
	    type:String,
	    ref:'User'
	 },//属于哪个subAdmin
	 isNote:String,//1.消息通知
	createDate:Date
});

module.exports = mongoose.model('Event', EventSchema);
