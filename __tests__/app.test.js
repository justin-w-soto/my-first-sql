require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns friends', async() => {

      const expectation = [
        {
          id: 1,
          name: 'turkey neck',
          cool_factor: 3,
        },
        {
          id: 2,
          name: 'crab claw',
          cool_factor: 4,
        },
        {
          id: 3,
          name: 'ham fist',
          cool_factor: 4,
        },
      
        {
          id: 4,
          name: 'block head',
          cool_factor: 10,
        },
      
        {
          id: 5,
          name: 'poindexter',
          cool_factor: 1,
        },
      
        {
          id: 6,
          name: 'grandma',
          cool_factor: 10,
        },
      
        {
          id: 7,
          name: 'Gator',
          cool_factor: 8,
        }
      ];

      const data = await fakeRequest(app)
        .get('/friends')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
