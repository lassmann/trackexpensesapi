'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './family.events';

var FamilySchema = new mongoose.Schema( {
  surname: { type: String, required: true },
  members: [ mongoose.Schema.Types.ObjectId ],
  expenseTypes: [String]
} );

registerEvents(FamilySchema);
export default mongoose.model('Family', FamilySchema);
