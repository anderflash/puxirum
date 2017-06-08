process.env.NODE_ENV = 'test';

import * as chai from 'chai';
var chaiHttp = require('chai-http');
import * as server from './server';

console.log(server);

const should = chai.should;
chai.use(chaiHttp);

describe('API routes', function() {
  it('should return a specific user', function() {
    chai.request(server)
      .get('/api/user?username=anderson')
      .end(function(err, res){
        console.log(res);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('id');
        res.body.id.should.equal(2);
        res.body.should.have.property('email');
        res.body.email.should.equal('anderson@email.com');
      })
  });
});