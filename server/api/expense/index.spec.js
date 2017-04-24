'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var expenseCtrlStub = {
  index: 'expenseCtrl.index',
  show: 'expenseCtrl.show',
  create: 'expenseCtrl.create',
  upsert: 'expenseCtrl.upsert',
  patch: 'expenseCtrl.patch',
  destroy: 'expenseCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var expenseIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './expense.controller': expenseCtrlStub
});

describe('Expense API Router:', function() {
  it('should return an express router instance', function() {
    expect(expenseIndex).to.equal(routerStub);
  });

  describe('GET /api/expenses', function() {
    it('should route to expense.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'expenseCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/expenses/:id', function() {
    it('should route to expense.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'expenseCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/expenses', function() {
    it('should route to expense.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'expenseCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/expenses/:id', function() {
    it('should route to expense.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'expenseCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/expenses/:id', function() {
    it('should route to expense.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'expenseCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/expenses/:id', function() {
    it('should route to expense.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'expenseCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
