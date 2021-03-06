/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/expenses              ->  index
 * POST    /api/expenses              ->  create
 * GET     /api/expenses/:id          ->  show
 * PUT     /api/expenses/:id          ->  upsert
 * PATCH   /api/expenses/:id          ->  patch
 * DELETE  /api/expenses/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {Expense} from './expense.model';


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Expenses
export function index(req, res) {
  return Expense.find({userId: req.user._id})
    .sort('-expenseDate')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Expense from the DB
export function show(req, res) {
  return Expense.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * return all the expense types of an user
 * @param req
 * @param res
 */
export function getExpenseTypes(req, res) {
  var lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  return Expense.find({
    userId: req.user._id,
    expenseDate: {
      $gte: lastMonth,
      $lte: new Date()
    }
  }, {expenseType: 1, _id: 0}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Expense in the DB
export function create(req, res) {
  req.body.userId = req.user && req.user._id;
  return Expense.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Expense in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Expense.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Expense in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Expense.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Expense from the DB. Only a user can delete it's expenses
export function destroy(req, res) {
  return Expense.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function getExpenses(req, res) {
  return Expense.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * Return all the expenses by date and ordered
 * you shoud pass the dates in format YYYY-MM-DD. ex api/expense/byDate?from=2017-01-01&to=2017-01-02
 */
export function getByDate(req, res) {
  const from = req.query.from ? new Date(req.query.from) : new Date();
  const to = req.query.to ? new Date(req.query.to) : new Date();

  return Expense
    .aggregate([
      {
        $match: {userId: req.user._id, expenseDate: {$gte: from, $lte: to}}
      },
      {
        $group: {
          _id: null,
          count: {$sum: 1},
          total: {$sum: '$amount'},
          expenses: {$push: '$$ROOT'}
        }
      }
    ])
    .sort('-expenseDate')
    .exec()
    .then(respondWithResult(res, 200))
    .catch(handleError(res));
}
