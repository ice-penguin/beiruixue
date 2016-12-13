'use strict';

var express = require('express');
var controller = require('./role.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole(['admin','subAdmin']), controller.index);
router.put('/:id', auth.hasRole(['admin','subAdmin']), controller.update);

module.exports = router;
