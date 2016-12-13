'use strict';

var express = require('express');
var controller = require('./product.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.hasRole('admin'), controller.create);
router.get('/', auth.hasRole('admin'), controller.index);
router.put('/destroyAll', auth.hasRole('admin'), controller.destroyAll);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.put('/changeState/:id', auth.hasRole('admin'), controller.changeState);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
