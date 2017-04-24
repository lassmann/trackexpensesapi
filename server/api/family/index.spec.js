'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var familyCtrlStub = {
  index: 'familyCtrl.index',
  show: 'familyCtrl.show',
  create: 'familyCtrl.create',
  upsert: 'familyCtrl.upsert',
  patch: 'familyCtrl.patch',
  destroy: 'familyCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var familyIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './family.controller': familyCtrlStub
});

describe('Family API Router:', function() {
  it('should return an express router instance', function() {
    expect(familyIndex).to.equal(routerStub);
  });

  describe('GET /api/family', function() {
    it('should route to family.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'familyCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/family/:id', function() {
    it('should route to family.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'familyCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/family', function() {
    it('should route to family.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'familyCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/family/:id', function() {
    it('should route to family.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'familyCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/family/:id', function() {
    it('should route to family.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'familyCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/family/:id', function() {
    it('should route to family.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'familyCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
