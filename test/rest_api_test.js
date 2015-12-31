/* jshint camelcase: false */
var app = require('../server/server');
var request = require('supertest');
var assert = require('assert');
var loopback = require('loopback');

function json(verb, url) {
    return request(app)[verb](url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
  }

describe('REST API request', function() {
  it('should take a sound and repeat it 3 times', function(done){
    json('post', '/api/cars/rev-engine')
      .send({
        sound: 'vroom'
      })
      .expect(200)
      .end(function(err, res){
        assert(typeof res.body === 'object');
        assert(res.body.engineSound);
        assert.equal(res.body.engineSound, 'vroom vroom vroom');
        done();
      });
  });

  it('should not crash the server when posting a bad id', function(done){
    json('post', '/api/cars/foobar')
      .send({})
      .expect(404, done);
  });
});
