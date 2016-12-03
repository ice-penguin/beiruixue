'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole(['admin','subAdmin','1','2','3','4']), controller.index);
router.put('/destroy/:id', auth.hasRole(['admin','subAdmin']), controller.destroy);
router.put('/destroyAll', auth.hasRole(['admin','subAdmin']), controller.destroyAll);
router.put('/recovery/:id', auth.hasRole(['admin']), controller.recovery);
router.put('/recoveryAll', auth.hasRole(['admin']), controller.recoveryAll);
// router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id', auth.isAuthenticated(), controller.show);
// router.put('/:id', auth.hasRole(['admin','subAdmin','1','2','3','4']), controller.update);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);//修改密码，需输入旧密码和新密码和上级修改下级
router.post('/subAdmin', auth.hasRole('admin'), controller.createSubAdmin);
router.post('/', auth.hasRole(['subAdmin','1','2','3','4']), controller.create);

module.exports = router;
