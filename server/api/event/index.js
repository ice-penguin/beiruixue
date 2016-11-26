'use strict';

var express = require('express');
var controller = require('./event.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('0','1','2','3','4'), controller.index);

module.exports = router;
