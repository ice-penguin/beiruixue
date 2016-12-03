'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

// router.get('/', auth.hasRole('admin'), controller.index);
// router.delete('/:id', auth.hasRole('admin'), controller.destroy);
// router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);//修改密码，需输入旧密码和新密码和上级修改下级
// router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/subAdmin', auth.hasRole('admin'), controller.createSubAdmin);
router.post('/', auth.hasRole(['subAdmin','1','2','3','4']), controller.create);

module.exports = router;
