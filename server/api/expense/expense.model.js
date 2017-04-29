'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './expense.events';

var ExpenseSchema = new mongoose.Schema({
  userId: {type:mongoose.Schema.Types.ObjectId, required: true},
  expense_date: { type: Date,  default: Date.now },
  amount: { type: Number, required: true },
  group: [mongoose.Schema.Types.ObjectId],
  description: String
});

var ExpenseTypeSchema = new mongoose.Schema({
  value: {type: String, required:true  },
  userId: {type: mongoose.Schema.Types.ObjectId, required: false}, //if a user add an expense a family can see it
  type: {type: String},//entry or expense
  language: {type: String, default: 'ENG'}
});

registerEvents(ExpenseSchema);

var Expense = mongoose.model('Expense', ExpenseSchema);
var ExpenseType = mongoose.model('ExpenseType', ExpenseTypeSchema);

exports.Expense = Expense;
exports.ExpenseType = ExpenseType;
