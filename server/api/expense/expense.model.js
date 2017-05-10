'use strict';

import mongoose from 'mongoose';
import { registerEvents } from './expense.events';

const ExpenseSchema = new mongoose.Schema( {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    kind: { type: String, required: true },//expense or entry
    expenseType: { type: String, required: true },
    expenseDate: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    description: String
  },
  {
    timestamps: true
  } );


registerEvents( ExpenseSchema );

const Expense = mongoose.model( 'Expense', ExpenseSchema );

exports.Expense = Expense;
