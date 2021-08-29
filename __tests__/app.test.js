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
    }, 20000);
  
    afterAll(done => {
      return client.end(done);
    });

    // RETURNS FRIENDS NAMES TEST

    test('GET / returns friends names', async() => {

      const expectation =  friendsData.map(friends => friends.name);

      const data = await fakeRequest(app)
        .get('/friends')
        .expect('Content-Type', /json/)
        .expect(200);

      const noms = data.body.map(friends => friends.name);

      expect(noms).toEqual(expectation);
      expect(noms.length).toBe(friendsData.length);

    }, 20000);
    
    
    // RETURNS FRIENDs DATA TEST
    
    test('GET /friends/:id returns individual friend data', async () => {
      const expectation = friendsData[0];
      expectation.id = 1;
      
      const data = await fakeRequest(app)
        .get('/friends/1')
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(data.body).toEqual(expectation);
    });
    
    // POST TEST
  
    test('POST / creates a new friend', async () => {
      const newfriend = {
        name: 'lil B',
        cool_factor: 5,
        cool_haircut: true
        
      };
  
      const data = await fakeRequest(app)
        .post('/friends')
        .send(newfriend)
        .expect(200)
        .expect('Content-Type', /json/);
        
      expect(data.body.name).toEqual(newfriend.name);
      expect(data.body.id).toBeGreaterThan(0);
  
    });
  
    // PUT TEST
  
    test('PUT / friends/:id updates friend', async () => {
      const updatedData = {
      
        name: 't neck',
        cool_factor: 5,
        cool_haircut: false
      };
    
      const data = await fakeRequest(app)
        .put('/friends/1')
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /json/);
    
      expect(data.body.name).toEqual(updatedData.name);
      expect(data.body.cool_factor).toEqual(updatedData.cool_factor);
    
    
    });
  });
});

// git is not responding, please acknowledge this change...