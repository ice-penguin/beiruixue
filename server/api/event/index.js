'use strict';

var express = require('express');
var controller = require('./event.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.hasRole(['1','2','3','4','admin','subAdmin']), controller.shipment);//出货记录创建
router.get('/', auth.hasRole(['1','2','3','4','admin','subAdmin']), controller.index);
router.put('/:id', auth.hasRole(['1','2','3','4','admin','subAdmin']), controller.read);

module.exports = router;
