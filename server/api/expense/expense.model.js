'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './expense.events';

const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    expenseDate: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    expenseTypeId: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: String
  },
  {
    timestamps: true
  });

const ExpenseTypeSchema = new mongoose.Schema({
  value: {type: String, required: true },
  userId: {type: mongoose.Schema.Types.ObjectId, required: false }, //if a user add an expense a family can see it
  type: {type: String },//entry or expense
  language: {type: String, default: 'ENG'}
});

registerEvents(ExpenseSchema);

const Expense = mongoose.model('Expense', ExpenseSchema);
const ExpenseType = mongoose.model('ExpenseType', ExpenseTypeSchema);

exports.Expense = Expense;
exports.ExpenseType = ExpenseType;
