'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newFamily;

describe('Family API:', function() {
  describe('GET /api/family', function() {
    var familys;

    beforeEach(function(done) {
      request(app)
        .get('/api/family')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          familys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(familys).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/family', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/family')
        .send({
          name: 'New Family',
          info: 'This is the brand new family!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newFamily = res.body;
          done();
        });
    });

    it('should respond with the newly created family', function() {
      expect(newFamily.name).to.equal('New Family');
      expect(newFamily.info).to.equal('This is the brand new family!!!');
    });
  });

  describe('GET /api/family/:id', function() {
    var family;

    beforeEach(function(done) {
      request(app)
        .get(`/api/family/${newFamily._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          family = res.body;
          done();
        });
    });

    afterEach(function() {
      family = {};
    });

    it('should respond with the requested family', function() {
      expect(family.name).to.equal('New Family');
      expect(family.info).to.equal('This is the brand new family!!!');
    });
  });

  describe('PUT /api/family/:id', function() {
    var updatedFamily;

    beforeEach(function(done) {
      request(app)
        .put(`/api/family/${newFamily._id}`)
        .send({
          name: 'Updated Family',
          info: 'This is the updated family!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedFamily = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFamily = {};
    });

    it('should respond with the updated family', function() {
      expect(updatedFamily.name).to.equal('Updated Family');
      expect(updatedFamily.info).to.equal('This is the updated family!!!');
    });

    it('should respond with the updated family on a subsequent GET', function(done) {
      request(app)
        .get(`/api/family/${newFamily._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let family = res.body;

          expect(family.name).to.equal('Updated Family');
          expect(family.info).to.equal('This is the updated family!!!');

          done();
        });
    });
  });

  describe('PATCH /api/family/:id', function() {
    var patchedFamily;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/family/${newFamily._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Family' },
          { op: 'replace', path: '/info', value: 'This is the patched family!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedFamily = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedFamily = {};
    });

    it('should respond with the patched family', function() {
      expect(patchedFamily.name).to.equal('Patched Family');
      expect(patchedFamily.info).to.equal('This is the patched family!!!');
    });
  });

  describe('DELETE /api/family/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/family/${newFamily._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when family does not exist', function(done) {
      request(app)
        .delete(`/api/family/${newFamily._id}`)
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
