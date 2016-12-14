'use strict';

var express = require('express');
var controller = require('./product.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.hasRole(['admin','subAdmin']), controller.create);
router.get('/', auth.hasRole(['admin','subAdmin','4','3','2','1']), controller.index);
router.put('/destroyAll', auth.hasRole(['admin','subAdmin']), controller.destroyAll);
router.get('/:id', auth.hasRole(['admin','subAdmin']), controller.show);
router.put('/:id', auth.hasRole(['admin','subAdmin']), controller.update);
router.put('/changeState/:id', auth.hasRole(['admin','subAdmin']), controller.changeState);
router.delete('/:id', auth.hasRole(['admin','subAdmin']), controller.destroy);

module.exports = router;
