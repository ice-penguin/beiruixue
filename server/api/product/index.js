'use strict';

var express = require('express');
var controller = require('./product.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.hasRole('admin'), controller.create);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
