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
    
          name: 'turkey neck',
          cool_factor: 3,
          cool_haircut: false,
          id: 1
        },
      
        {
          
          name: 'crab claw',
          cool_factor: 4,
          cool_haircut: false,
          id: 2
        },
      
        {
         
          name: 'ham fist',
          cool_factor: 4,
          cool_haircut: false,
          id: 3
        },
      
        {
          
          name: 'block head',
          cool_factor: 10,
          cool_haircut: false,
          id: 4
        },
      
        {
          
          name: 'poindexter',
          cool_factor: 1,
          cool_haircut: false,
          id: 5
        },
      
        {
          
          name: 'grandma',
          cool_factor: 10,
          cool_haircut: true,
          id: 6
        },
      
        {
          
          name: 'Gator',
          cool_factor: 8,
          cool_haircut: false,
          id: 7
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
