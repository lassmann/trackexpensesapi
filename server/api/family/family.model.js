'use strict';

import mongoose from 'mongoose';
import { registerEvents } from './family.events';

var FamilySchema = new mongoose.Schema( {
  surname: { type: String, required: true },
  members: [ { type: mongoose.Schema.Types.ObjectId, Ref: 'User' } ],
  owner: [ { type: mongoose.Schema.Types.ObjectId, Ref: 'User' } ],
  expenseTypes: [ String ],
  image: String
} );

registerEvents( FamilySchema );
export default mongoose.model( 'Family', FamilySchema );
