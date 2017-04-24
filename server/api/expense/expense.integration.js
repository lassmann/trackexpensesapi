'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newExpense;

describe('Expense API:', function() {
  describe('GET /api/expenses', function() {
    var expenses;

    beforeEach(function(done) {
      request(app)
        .get('/api/expenses')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          expenses = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(expenses).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/expenses', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/expenses')
        .send({
          name: 'New Expense',
          info: 'This is the brand new expense!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newExpense = res.body;
          done();
        });
    });

    it('should respond with the newly created expense', function() {
      expect(newExpense.name).to.equal('New Expense');
      expect(newExpense.info).to.equal('This is the brand new expense!!!');
    });
  });

  describe('GET /api/expenses/:id', function() {
    var expense;

    beforeEach(function(done) {
      request(app)
        .get(`/api/expenses/${newExpense._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          expense = res.body;
          done();
        });
    });

    afterEach(function() {
      expense = {};
    });

    it('should respond with the requested expense', function() {
      expect(expense.name).to.equal('New Expense');
      expect(expense.info).to.equal('This is the brand new expense!!!');
    });
  });

  describe('PUT /api/expenses/:id', function() {
    var updatedExpense;

    beforeEach(function(done) {
      request(app)
        .put(`/api/expenses/${newExpense._id}`)
        .send({
          name: 'Updated Expense',
          info: 'This is the updated expense!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedExpense = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedExpense = {};
    });

    it('should respond with the updated expense', function() {
      expect(updatedExpense.name).to.equal('Updated Expense');
      expect(updatedExpense.info).to.equal('This is the updated expense!!!');
    });

    it('should respond with the updated expense on a subsequent GET', function(done) {
      request(app)
        .get(`/api/expenses/${newExpense._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let expense = res.body;

          expect(expense.name).to.equal('Updated Expense');
          expect(expense.info).to.equal('This is the updated expense!!!');

          done();
        });
    });
  });

  describe('PATCH /api/expenses/:id', function() {
    var patchedExpense;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/expenses/${newExpense._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Expense' },
          { op: 'replace', path: '/info', value: 'This is the patched expense!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedExpense = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedExpense = {};
    });

    it('should respond with the patched expense', function() {
      expect(patchedExpense.name).to.equal('Patched Expense');
      expect(patchedExpense.info).to.equal('This is the patched expense!!!');
    });
  });

  describe('DELETE /api/expenses/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/expenses/${newExpense._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when expense does not exist', function(done) {
      request(app)
        .delete(`/api/expenses/${newExpense._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
