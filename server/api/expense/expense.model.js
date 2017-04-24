'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './expense.events';

var ExpenseSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  expense_date: { type: Date,  default: Date.now },
  amount: { type: Number, required: true },
  group: [mongoose.Schema.Types.ObjectId],
  description: String
});

registerEvents(ExpenseSchema);
export default mongoose.model('Expense', ExpenseSchema);
