'use strict';

var express = require('express');
var controller = require('./expense.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/byDate', auth.isAuthenticated(), controller.getByDate);
router.get('/expenseTypes', auth.isAuthenticated(),controller.getExpenseTypes);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(),controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);


module.exports = router;
