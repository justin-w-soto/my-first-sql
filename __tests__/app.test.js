require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const friendsData = require('../data/friends.js');

describe('app routes', () => {
  describe('routes', () => {
    // let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
      await client.connect();
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('GET / returns friends names', async() => {

      const expectation =  friendsData.map(friends => friends.name);

      const data = await fakeRequest(app)
        .get('/friends')
        .expect('Content-Type', /json/)
        .expect(200);

      const noms = data.body.map(friends => friends.name);

      expect(noms).toEqual(expectation);
      expect(noms.length).toBe(friendsData.length);

    }, 10000);
  });
});
