const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

const AuthConstant = require('../modules/auth/auth.constant');

chai.use(chaiHttp);

describe('Auth', () => {
  it('Login test :: Email not exists', (done) => {
    try {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({ email: 'abc@gmail.com', password: '123456789' })
        .end((err, res) => {
          if (err) {
            console.log(err);
            done();
          }

          if (res) {
            res.should.have.status(400);
            // res.should.be.json;
            // res.body.should.be.a('object');
            // res.body.should.have.property('messages');
            // res.body.should.have.messages([
            //   AuthConstant.MESSAGES.LOGIN.MAIL_NOT_FOUND_OR_PASSWORD_NOT_MATCH,
            // ]);
            done();
          }
        });
    } catch (e) {
      console.error(e);
      done(e);
    }
  });

  it('Login test :: Email exists and password not match', (done) => {
    try {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({ email: 'admin2020@gmail.com', password: '12345678' })
        .end((err, res) => {
          if (err) {
            console.log(err);
            done();
          }

          if (res) {
            res.should.have.status(400);
            done();
          }
        });
    } catch (e) {
      console.error(e);
      done(e);
    }
  });

  it('Login test :: Email and password is empty', (done) => {
    try {
      chai
        .request(server)
        .post('/api/auth/login')
        .end((err, res) => {
          if (err) {
            console.log(err);
            done();
          }

          if (res) {
            res.should.have.status(400);
            done();
          }
        });
    } catch (e) {
      console.error(e);
      done(e);
    }
  });

  it('Login test :: Email and password are correct', (done) => {
    try {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({ email: 'admin2020@gmail.com', password: '123456789' })
        .end((err, res) => {
          if (err) {
            console.log(err);
            done();
          }

          if (res) {
            res.should.have.status(200);
            done();
          }
        });
    } catch (e) {
      console.error(e);
      done(e);
    }
  });
});
