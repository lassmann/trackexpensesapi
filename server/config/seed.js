/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import {ExpenseType} from '../api/expense/expense.model'
import config from './environment/';
import  expenseTypes from './seeds/expenseType'

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) {
    User.find({}).remove()
      .then(() => {
        User.create([{
          provider: 'local',
          name: 'Lucas Assmann',
          email: 'l.assmann.30@gmail.com',
          password: 'admin',
          language: 'SPA'
        },
          {
            provider: 'local',
            name: 'Samanta casal',
            email: 'samanta.maria.casal@gmail.com',
            password: 'admin',
            language: 'SPA'
          }])
        .then(() => console.log('finished populating users'))
        .catch(err => console.log('error populating users', err));
      });

    ExpenseType.find({}).remove()
      .then(()=>{
        ExpenseType.create(expenseTypes )
      })
      .then(() => console.log('finished populating expensetypes'))
      .catch(err => console.log('error populating expensetypes', err));

  }
}
