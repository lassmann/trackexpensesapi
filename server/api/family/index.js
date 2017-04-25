'use strict';

var express = require('express');
var controller = require('./family.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);
router.put('/family/:id/addMember/:uID', controller.addMember);
router.put('/family/:id/addOwner/:uId', controller.addOwner);
router.delete('/:id/deleteOwner/:uId', controller.deleteOwner);
router.delete('/:id/deleteMember/:uId', controller.deleteMember);
router.post('/:id/requestInvite/:uId', controller.requestInvite);
router.get('/:id/expensesByDate', controller.getExpenses);


module.exports = router;
