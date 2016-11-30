'use strict';

var express = require('express');
var controller = require('./event.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.hasRole(['1','2','3','4','admin','subAdmin']), controller.shipment);//出货记录创建
router.get('/', auth.hasRole(['1','2','3','4','admin','subAdmin']), controller.index);
router.put('/:id', auth.hasRole(['1','2','3','4','admin','subAdmin']), controller.read);
router.put('/readAll/:id', auth.hasRole(['1','2','3','4','subAdmin']), controller.readAll);//subAdmin和代理一键阅读

module.exports = router;
