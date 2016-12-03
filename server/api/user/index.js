'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole(['admin','subAdmin','1','2','3','4']), controller.index);
router.put('/:id', auth.hasRole(['admin','subAdmin']), controller.destroy);
router.put('/destroyAll/:id', auth.hasRole(['admin','subAdmin']), controller.destroyAll);
// router.get('/me', auth.isAuthenticated(), controller.me);
// router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/subAdmin', auth.hasRole('admin'), controller.createSubAdmin);
router.post('/', auth.hasRole(['subAdmin','1','2','3','4']), controller.create);

module.exports = router;
