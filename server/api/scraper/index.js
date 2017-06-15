'use strict';

var express = require('express');
var controller = require('./scraper.controller');

var router = express.Router();

router.get('/cityranking/:language/:city', controller.cityRanking);
router.get('/countryranking/:language/:country', controller.countryRanking);
router.get('/ranking/world/:language', controller.worldRanking);
router.get('/userRanking/:username', controller.userRanking);

module.exports = router;
