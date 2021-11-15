'use strict';

process.env.SECRET = "toes";

const supertest = require('supertest');
const server = require('../../../src/server.js').server;
const { db } = require('../../../src/auth/models/index.js');

const mockRequest = supertest(server);


let admin = { username: 'admin', password: 'password' }
let editor = { username: 'editor', password: 'password' }
let user = { username: 'user', password: 'password' }


beforeAll(async (done) => {
  await db.sync();
  done();
});
afterAll(async (done) => {
  await db.drop();
  done();
});


describe('Auth Router', () => {



  describe(`all users`, () => {

    it('can create one - admin', async (done) => {

      const response = await mockRequest.post('/signup').send(admin);
      const userObject = response.body;

      expect(response.status).toBe(201);
      expect(userObject.token).toBeDefined();
      expect(userObject.user.id).toBeDefined();
      expect(userObject.user.username).toEqual(admin.username)
      done();
    });
    it('can create one - editor', async (done) => {

      const response = await mockRequest.post('/signup').send(editor);
      const userObject = response.body;

      expect(response.status).toBe(201);
      expect(userObject.token).toBeDefined();
      expect(userObject.user.id).toBeDefined();
      expect(userObject.user.username).toEqual(editor.username)
      done();
    });
    it('can create one - user', async (done) => {

      const response = await mockRequest.post('/signup').send(user);
      const userObject = response.body;

      expect(response.status).toBe(201);
      expect(userObject.token).toBeDefined();
      expect(userObject.user.id).toBeDefined();
      expect(userObject.user.username).toEqual(user.username)
      done();
    });

    it('can signin with basic - admin', async (done) => {

      const response = await mockRequest.post('/signin')
        .auth(admin.username, admin.password);

      const userObject = response.body;
      expect(response.status).toBe(200);
      expect(userObject.token).toBeDefined();
      expect(userObject.user.id).toBeDefined();
      expect(userObject.user.username).toEqual(admin.username)
      done();
    });
    it('can signin with basic - editor', async (done) => {

      const response = await mockRequest.post('/signin')
        .auth(editor.username, editor.password);

      const userObject = response.body;
      expect(response.status).toBe(200);
      expect(userObject.token).toBeDefined();
      expect(userObject.user.id).toBeDefined();
      expect(userObject.user.username).toEqual(editor.username)
      done();
    });
    it('can signin with basic - user', async (done) => {

      const response = await mockRequest.post('/signin')
        .auth(user.username, user.password);

      const userObject = response.body;
      expect(response.status).toBe(200);
      expect(userObject.token).toBeDefined();
      expect(userObject.user.id).toBeDefined();
      expect(userObject.user.username).toEqual(user.username)
      done();
    });

    it('can signin with bearer - admin', async (done) => {

      // First, use basic to login to get a token
      const response = await mockRequest.post('/signin')
        .auth(admin.username, admin.password);

      const token = response.body.token;

      // First, use basic to login to get a token
      const bearerResponse = await mockRequest
        .get('/users')
        .set('Authorization', `Bearer ${token}`)

      // Not checking the value of the response, only that we "got in"
      expect(bearerResponse.status).toBe(200);
      done();
    });
    it('can signin with bearer - editor', async (done) => {

      // First, use basic to login to get a token
      const response = await mockRequest.post('/signin')
        .auth(editor.username, editor.password);
      const token = response.body.token;
      // First, use basic to login to get a token
      const bearerResponse = await mockRequest
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
      // Not checking the value of the response, only that we "got in"
      expect(bearerResponse.status).toBe(200);
      done();
    });
    it('can signin with bearer - user', async (done) => {

      // First, use basic to login to get a token
      const response = await mockRequest.post('/signin')
        .auth(user.username, user.password);
      const token = response.body.token;
      // First, use basic to login to get a token
      const bearerResponse = await mockRequest
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
      // Not checking the value of the response, only that we "got in"
      expect(bearerResponse.status).toBe(200);
      done();
    });



    describe('bad logins', () => {
      it('basic fails with known user and wrong password ', async (done) => {
        const response = await mockRequest.post('/signin')
        .auth('admin', 'xyz')
        const userObject = response.body;
        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();
        done();
      });

      it('basic fails with unknown user', async (done) => {
        const response = await mockRequest.post('/signin')
        .auth('nobody', 'xyz')
        const userObject = response.body;
        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined()
        done();
      });

      it('bearer fails with an invalid token', async (done) => {
        // First, use basic to login to get a token
        const bearerResponse = await mockRequest
          .get('/users')
          .set('Authorization', `Bearer foobar`)
        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(403);
        done();
      })
    })
  })
});